const quilt = require("@quilt/quilt");

var namespace = quilt.createDeployment({namespace:"food-finder"});

var base_machine = new quilt.Machine({
    provider: "Amazon",
    size: 'm4.large',
    sshKeys: quilt.githubKeys("hantaowang"), // Your github username here
    preemptible: true,
});

var Etcd = require("@quilt/etcd");
var etcd = new Etcd.Etcd(2);

var Redis = require("@quilt/redis")
var redis = new Redis(1, 'abcdef12345');

function getHostname(c) {
    return c.getHostname();
}

const etcdhosts = etcd.containers.map(getHostname).join(',');

var app = new quilt.Container("django", "hantaowang/foodfinder", {
  env: {
    'redishost': redis.master.getHostname(),
    'redispass': "abcdef12345",
    'etcdhost': etcdhosts
  }
});



app.allowFrom(redis.master, 6379);
redis.master.allowFrom(app, 6379);

etcd.containers.forEach(function(c) {
  app.allowFrom(c, 2379);
  c.allowFrom(app, 2379);
});

namespace.deploy(base_machine.asMaster());
namespace.deploy(base_machine.asWorker());
namespace.deploy([app, redis, etcd]);
