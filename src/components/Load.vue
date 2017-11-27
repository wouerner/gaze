<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <h1>Poloniex View Load Data</h1>
            <button v-on:click="eraseDataAll" class="btn btn-danger">Reset All</button>
            <table class="table table-striped">
                <thead>
                    <th>
                        Currency
                    </th>
                    <th>
                        filter
                    </th>
                    <th>
                        action
                    </th>
                </thead>
                <tbody>
                    <tr v-for="(currency, index) in currencies">
                        <td>
                            {{index}}
                        </td>
                        <td>
                            <form class="form-inline">
                                <div class="form-group">
                                    from  <input name="from" class="form-control" v-model="fromDate"> to <input name="toData" class="form-control" v-model="toDate">
                                </div>
                            </form>
                        </td>
                        <td>
                            <button v-on:click="load(index)" class="btn btn-success">Load</button>
                            <button v-on:click="eraseData(index)" class="btn btn-danger">Reset Data</button>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'load',
  data () {
    return {
      currencies: [],
      fromDate: '2016-01-01 00:00:00'
    }
  },
  computed: {
    toDate: function () {
      return moment().format('YYYY-MM-D H:mm:s')
    }
  },
  methods: {
    eraseData: function (currency) {
      this.$http
          .get('load.php?comando=eraseData&currency=' + currency)
          .then(response => {
            this.coinsSell = response.body
          })
    },
    eraseDataAll: function () {
      this.$http
          .get('load.php?comando=eraseData')
          .then(response => {
            this.coinsSell = response.body
          })
    },
    load: function (currency) {
      console.log(currency, this.toDate)
      this.$http
          .get('load.php?comando=load&currency=' + currency +
            '&end=' + moment(this.toDate).utc().unix() +
            '&start=' + moment(this.fromDate).utc().unix())
          .then(response => {
            this.coinsSell = response.body
          })
    }
  },
  mounted: function () {
    this.$http
        .get('api.php?comando=currencies')
        .then(response => {
          this.currencies = response.body
        })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
