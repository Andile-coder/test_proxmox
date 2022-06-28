const process = require("dotenv");
const axios = require("axios");
const pve = require("@corsinvest/cv4pve-api-javascript");
const Test = async () => {
  var client = new pve.PveClient("141.94.141.230", 8006);
  var login = await client.login("root", "8ZAV7cvMqlH8TS1S", "pam");
  if (login) {
    console.log("login", login);
    //get nodes
    const nodes = (await client.nodes.index()).response;
    const configured = [];
    //get qemu of all nodes
    async function getQemu() {
      for (let i = 0; i < nodes?.data?.length; i++) {
        const qemus = (
          await client.nodes.get(nodes.data[i].node).qemu.vmlist(0)
        ).response;

        for (let j = 0; j < qemus.data.length; j++) {
          const item = (
            await client.nodes.get("test-prox").qemu.get(103).config.vmConfig()
          ).response;
          configured.push(item);
        }
      }

      return configured;
    }

    const secondFoo = async () => {
      const result = await getQemu();
      console.log(result);
    };
    secondFoo();
  }
};

Test();
