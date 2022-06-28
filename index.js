const process = require("dotenv");
const axios = require("axios");
const pve = require("@corsinvest/cv4pve-api-javascript");
const Test = async () => {
  var client = new pve.PveClient("141.94.141.230", 8006);
  var login = await client.login("root", "8ZAV7cvMqlH8TS1S", "pam");
  if (login) {
    console.log("login", login);
    //get nodes
    const nodez = (await client.nodes.index()).response;

    //get qemu of all nodes
    const getQemu = async () => {
      const configuredQemu = [];
      for (let i = 0; i < nodez.data.length; i++) {
        const qemus = (
          await client.nodes.get(nodez.data[i].node).qemu.vmlist(0)
        ).response;

        qemus?.data?.forEach(async (elem) => {
          const item = await client.nodes
            .get(nodez.data[i].node)
            .qemu.get(elem.vmid)
            .config.vmConfig().response;
          configuredQemu.concat(item);
        });
      }
      return configuredQemu;
    };

    const test = getQemu();
    console.log("test", test);
  }
};

Test();
