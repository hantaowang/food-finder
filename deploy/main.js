const {createDeployment, Machine, githubKeys, Container, Service, publicInternet} = require("@quilt/quilt");

var namespace = createDeployment({namespace:"food-finder"});

var base_machine = new Machine({
    provider: "Amazon",
    size: 'm4.large',
    sshKeys: githubKeys("hantaowang"), // Your name here
    preemptible: true,
});

var Redis = require("./redis.js");
var redis = new Redis(1, 'None');

var Etcd = require("@quilt/etcd");
var etcd = new etcd.Etcd(2);

var food_finder = new Container("hantaowang/flaskapp")
    .withEnv({"redishost": redis.hostname(), "etcdhost": etcd.hostname()});

namespace.deploy(base_machine.asMaster());
namespace.deploy(base_machine.asWorker());
namespace.deploy(redis);
namespace.deploy(etcd);
