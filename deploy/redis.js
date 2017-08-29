const {publicInternet, Service, Container} = require('@quilt/quilt');

const port = 6379;
const image = "hantaowang/redis";

/**
 * Creates a replicated Redis database.
 * @param {number} nWorker - The desired number of Redis replicas.
 * @param {string} auth - The password for authenticating with Redis instances.
 */
function Redis(nWorker, auth) {
    this.master = createMaster(auth);
    this.workers = createWorkers(nWorker, auth, this.master);
    
    this.master.allowFrom(this.workers, port);
    this.workers.allowFrom(this.master, port);

    this.deploy = function(deployment) {
        deployment.deploy([this.master, this.workers]);
    };

    // Only masters can accept write requests, so for simplicity, allowFrom
    // only connects other services to the master.
    this.allowFrom = function(senderService, port) {
      this.master.allowFrom(senderService, port);
    };
}

/**
 * Creates a service with a master Redis instance.
 * @param {string} auth - The password for autheticating with Redis.
 * @return {Service} - The Redis master service.
 */
function createMaster(auth) {
    let master_redis = new Container("hantaowang/redis").withEnv({
            'ROLE': 'master',
            'AUTH': auth
    });
    master_redis.setHostname('redis_master');
    
    return new Service('redis-ms', [master_redis]);
}

/**
 * Creates a service with replicated Redis workers.
 * @param {number} n - The desired number of workers.
 * @param {string} auth - The password for autheticating with Redis.
 * @param {Service} master - The master Redis service.
 * @return {Service} - The worker Redis service.
 */
function createWorkers(n, auth, master) {
    let refWorker = new Container(image).withEnv({
        'ROLE': 'worker',
	'AUTH': auth,
        'MASTER': master.hostname(),
    });
    return new Service('redis-wk', refWorker.replicate(n));
};

Redis.prototype.services = function() {
    return [this.master, this.workers]
};

Redis.prototype.connect = function(p, to) {
    var services = to.services();
    for (i = 0; i < services.length; i++) {
	this.workers.connect(p, services[i]);
	this.master.connect(p, services[i]);
    }
};

Redis.prototype.debug = function() {
    this.master.connect(8081, publicInternet);
    this.master.connect(8080, publicInternet);
    this.master.connect(80, publicInternet);
    this.master.connect(53, publicInternet);
    this.master.connect(443, publicInternet);
    this.master.connect(5000, publicInternet);

    publicInternet.connect(8080, this.master);
    publicInternet.connect(5000, this.master);
    publicInternet.connect(8081, this.master);
    publicInternet.connect(53, this.master);
    publicInternet.connect(443, this.master);
    publicInternet.connect(80, this.master);

    this.workers.connect(8081, publicInternet);
    this.workers.connect(8080, publicInternet);
    this.workers.connect(80, publicInternet);
    this.workers.connect(53, publicInternet);
    this.workers.connect(443, publicInternet);
    this.workers.connect(5000, publicInternet);

    publicInternet.connect(8080, this.workers);
    publicInternet.connect(5000, this.workers);
    publicInternet.connect(8081, this.workers);
    publicInternet.connect(53, this.workers);
    publicInternet.connect(443, this.workers);
    publicInternet.connect(80, this.workers);
};

module.exports = Redis;
