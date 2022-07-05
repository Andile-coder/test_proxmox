const process = require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const pve = require("@corsinvest/cv4pve-api-javascript");
const Test = async () => {
  var client = new pve.PveClient("mwprox04.cloudoffice.co.za", 8006);
  var login = await client.login(
    "noc_audit",
    "Friday-Uproar6-Wrongdoer-Issuing",
    "pve"
  );
  if (login) {
    console.log("login", login);
    const configuredQemu = [];
    const configuredLxc = [];
    const configuredPools = [];
    //get nodes
    const nodes = (await client.nodes.index()).response;

    //get all pools
    const getPools = async () => {
      const pools = (await client.pools.index()).response;
      for (let i = 0; i < pools.data?.length; i++) {
        let pool = (await client.pools.get(pools.data[i].poolid).readPool())
          .response;
        pool = { ...pool.data, poolid: pools.data[i].poolid };
        configuredPools.push(pool);
      }
      return configuredPools;
    };
    //get qemu of all nodes
    async function getQemu() {
      for (let i = 0; i < nodes?.data?.length; i++) {
        const qemu = (await client.nodes.get(nodes.data[i].node).qemu.vmlist(0))
          .response;

        for (let j = 0; j < qemu.data.length; j++) {
          let item = (
            await client.nodes
              .get(nodes.data[i].node)
              .qemu.get(qemu.data[j].vmid)
              .config.vmConfig()
          ).response;
          item = {
            ...item.data,
            status: qemu.data[j]?.status,
            vmid: qemu.data[j]?.vmid,
          };
          configuredQemu.push(item);
        }
      }
      return configuredQemu;
    }
    //get lxc of all nodes
    const getLxc = async () => {
      for (let i = 0; i < nodes?.data?.length; i++) {
        const lxc = (await client.nodes.get(nodes.data[i].node).lxc.vmlist())
          .response;
        for (let j = 0; j < lxc.data.length; j++) {
          let item = (
            await client.nodes
              .get(nodes.data[i].node)
              .lxc.get(lxc.data[j].vmid)
              .config.vmConfig()
          ).response;
          item = {
            ...item.data,
            status: lxc.data[j]?.status,
            vmid: lxc.data[j]?.vmid,
          };

          configuredLxc.push(item);
        }
      }
      return configuredLxc;
    };

    //create json file

    const jsonFilecreator = (data, fileName) => {
      try {
        const stringifyData = JSON.stringify(data);
        fs.writeFile(`${fileName}.json`, stringifyData, (err) => {
          if (err) {
            throw err;
          } else {
            console.log("file has been saved");
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    const runner = async () => {
      const qemu = await getQemu();
      const lxc = await getLxc();
      const pools = await getPools();
      jsonFilecreator(qemu, "vms");
      jsonFilecreator(lxc, "containers");
      jsonFilecreator(pools, "pools");
      // jsonFilecreator(nodes, "nodes");
    };
    runner();
  } else {
    console.log("login", login);
  }
};

Test();
