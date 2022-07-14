const vms = require("./vms.json");
const containers = require("./containers.json");
const getStorage = (instance) => {
  let storageCount = [];
  let storages = [];

  instance.forEach((vm) => {
    let count = 0;
    let tempNets = [];

    for (let [key, value] of Object.entries(vm)) {
      if (value.toString().includes("size=")) {
        count++;
        value = value.toString();
        let net1 = value.split(",").map((elem) => elem.split("="));
        net1[0] = net1[0].join("").split(":")[0];
        let net2 = {};
        net1.forEach((elem) => {
          switch (elem[0]) {
            case "size":
              net2 = { ...net2, size: elem[1] };
              break;
            case "Mwhdd":
              net2 = { ...net2, Mwhdd: elem[1] };
              break;
            case "local-zfs":
              net2 = { ...net2, local_zfs: elem[1] };
              break;
          }
        });

        tempNets.push(net2);
      }
    }

    storageCount.push(count);
    storages.push(tempNets);
  });

  const newInstance = instance.map((vm, index) => {
    return { ...vm, Storage: storages[index] };
  });
  console.log(newInstance);
};
getStorage(containers);
