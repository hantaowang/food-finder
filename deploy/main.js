const {createDeployment, Machine, githubKeys, Container, Service, publicInternet} = require("@quilt/quilt");

var namespace = createDeployment({namespace:"food-finder"});

var base_machine = new Machine({
    provider: "Amazon",
    size: 'm4.large',
    sshKeys: githubKeys("hantaowang"), // Your github username here
    preemptible: true,
});

var Etcd = require("@quilt/etcd");
var etcd = new Etcd.Etcd(2);

var Redis = require("@quilt/redis");
var redis = new Redis(1, 'abcdef12345');

var etcdhosts = ""
etcd.cluster.forEach(function(c) {
    etcdhosts += c.getHostname() + ",";
});

var app = new Container("django", "hantaowang/foodfinder")
    .withEnv({"redishost": redis.master.getHostname(), "etcdhost": etcdhosts, "redispass": "abcdef12345"});

app.allowFrom(redis.master, 6379);
redis.master.allowFrom(app, 6379);

etcd.cluster.forEach(function(c) {
  app.allowFrom(c, 2379);
  c.allowFrom(app, 2379);
});

namespace.deploy(base_machine.asMaster());
namespace.deploy(base_machine.asWorker());
namespace.deploy([app, redis, etcd]);
