const vms = require("./vms.json");

console.log(vms);
//how many networks each vm

const getNets = () => {
  let networkCount = [];
  let nets = [];

  vms.forEach((vm) => {
    let count = 0;
    let tempNets = [];
    for (const [key, value] of Object.entries(vm)) {
      if (key.includes("net")) {
        count++;
        let net1 = value.split(",").map((elem) => elem.split("="));
        let net2 = {};
        net1.forEach((elem) => {
          switch (elem[0]) {
            case "virtio":
              net2 = { ...net2, virtio: elem[1] };
              break;
            case "tag":
              net2 = { ...net2, tag: elem[1] };
              break;
            case "bridge":
              net2 = { ...net2, bridge: elem[1] };
              break;
            case "e1000":
              net2 = { ...net2, e1000: elem[1] };
              break;
          }
        });

        tempNets.push(net2);
      }
    }

    networkCount.push(count);
    nets.push(tempNets);
  });

  const newVms = vms.map((vm, index) => {
    return { ...vm, networks: nets[index] };
  });
};

const getNets1 = () => {};
