<template class="fill-height">
  <v-data-table
      v-model="selected"
      :headers="clientHeaders"
      :items="clients"
      :single-expand=false
      :expanded.sync="expanded"
      :single-select="singleSelect"
      item-key="hostname"
      show-expand
      show-select
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1 fill-height"
  >
    <template v-slot:item.online="{ item }">
      <v-chip
          :color="getColor(item.online)"
          dark
      >
        {{ item.online }}
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Clients</v-toolbar-title>
<!--        <v-spacer></v-spacer>-->
<!--        <v-switch-->
<!--            v-model="singleExpand"-->
<!--            label="Single expand"-->
<!--            class="mt-2"-->
<!--        ></v-switch>-->
        <v-spacer></v-spacer>
        <v-icon
            large
            color="green"
            v-if="connected"
        >
          mdi-check-network
        </v-icon>
        <v-icon
            large
            color="yellow"
            v-else-if="connecting"
        >
          mdi-check-network
        </v-icon>
        <v-icon
            large
            color="red"
            v-else
        >
          mdi-close-network
        </v-icon>
        <v-divider class="mx-4" vertical></v-divider>
        <v-dialog
            v-model="dialog"
            width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-if="selected.length > 0"
                color="yellow"
                v-bind="attrs"
                v-on="on"
            >
              Reboot Selected
            </v-btn>
            <v-btn
                v-else
                color="red"
                v-bind="attrs"
                v-on="on"
            >
              Reboot All
            </v-btn>
          </template>
          <v-card>
            <v-card-title v-if="selected.length > 0" class="text-h6 grey lighten-2">
              Are you sure you want to reboot selected clients?
            </v-card-title>
            <v-card-title v-else class="text-h6 grey lighten-2">
              Are you sure you want to reboot all clients?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  @click="rebootAll(); dialog = false"
              >
                Yes
              </v-btn>
              <v-btn
                  @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
<!--    <template v-slot="items" slot-scope="props">-->
<!--      <tr @click="props.expanded = !props.expanded">-->
<!--      </tr>-->
<!--    </template>-->
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
<!--        More info about {{ item.name }}-->
        <v-btn
            v-if="item.inConfig"
            class="mx-2"
            @click="removeFromConfig(item.hostname)"
        >
          Remove
        </v-btn>
        <v-btn
            v-else
            class="mx-2"
            @click="addToConfig(item.hostname)"
        >
          Add
        </v-btn>
        <v-btn
            class="mx-2"
            color="red"
            @click="reboot(item.hostname)"
        >
          Reboot
        </v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import * as ws from '../plugins/websocket';
// import {isConnected} from "../plugins/websocket";

export default {
  name: "ClientList",

  mounted: function () {
    ws.addEventListener((message) => {
      // console.log(message.data)
      if (message.data.charAt(0) === '{') {
        let m = message.data.replace(/\//g, '')
        this.clients = []
        let map = new Map()

        for (const value in JSON.parse(m)) {
          map.set(value, JSON.parse(m)[value])
        }

        let myself = this

        map.forEach(function (client) {
          let c = {
            hostname: client.hostname,
            online: client.online,
            inConfig: client.in_config,
            cpuUsage: client.cpu.usage.toFixed(2),
            cpuTemp: client.cpu.temperature.toFixed(2),
          }
          myself.clients.push(c)
        })
      }
      else {
        console.log("Error message " + message.data + " is not valid json")
      }
    })

    window.setInterval(() => {
      this.update()
    }, 1000)
  },

  methods: {
    update: function () {
      ws.sendMessage("get")

      this.connected = ws.isConnected()
      this.connecting = ws.isConnecting()
    },
    addClient: function (client) {
      this.clients.push(client)
    },
    getColor: function (online) {
      if (online) {
        return 'green'
      } else {
        return 'red'
      }
    },
    reboot: function (hostname) {
      ws.sendMessage("reboot " + hostname)
    },
    rebootAll: function () {
      if (this.selected.length > 0) {
        for (const client of this.selected) {
          if (client.online) {
            ws.sendMessage("reboot " + client.hostname)
          }
        }
      }
      else {
        for (const client of this.clients) {
          if (client.online) {
            ws.sendMessage("reboot " + client.hostname)
          }
        }
      }
    },
    addToConfig: function (hostname) {
      ws.sendMessage("add " + hostname)
    },
    removeFromConfig: function (hostname) {
      ws.sendMessage("remove " + hostname)
    },
  },

  data: () => ({
    selected: [],
    singleSelect: false,
    dialog: false,
    connected: false,
    connecting: false,
    itemsPerPage: 100,
    expanded: [],
    clientHeaders: [
      {text: 'Hostname', value: 'hostname'},
      {text: 'Online', value: 'online'},
      {text: 'Cpu %', value: 'cpuUsage'},
      {text: 'Cpu Temperature', value: 'cpuTemp'},
      {text: '', value: 'data-table-expand'},
    ],
    clients: [],
  }),
}
</script>

<style scoped>



</style>