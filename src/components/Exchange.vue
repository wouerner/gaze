<template>
    <div id="exchange">
    <div class="row">
        <div class="col-md-2">
            <img :src="imagePath" width="100">
        </div>
        <div class="col-md-8">
            <h1>Poloniex View Trade</h1>
			<button v-for="(currency, index ) in currencies" v-on:click="getData" v-bind:value="currency" class="btn btn-default btn-lg"> {{currency}} </button>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <table class="table table-bordered table-responsive">
                <caption>Exchange {{ currency }}</caption>
                <tbody>
                    <tr>
                        <td>Total: {{ totalCurrency }} ({{ currency }})</td>
                        <td>Last Price: {{ rateCurrent }}</td>
                        <td>Buy Avg: {{ rateAvg }} (BTC)</td>
                        <td>Current Value: {{ valueCurrent}} (BTC)</td>
                        <td v-bind:class="[ condition ? 'danger' : 'text-success' ]">Profit/Loss: {{ profitLoss }} (BTC)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    <div class="col-md-6 ">
        <table class="table table-bordered table-responsive">
            <caption>
                <h4>Totais Compras</h4>
            </caption>
            <thead>
                <tr>
                    <th> Rate </th>
                    <th> Amount </th>
                    <th> Total </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> {{ rateAvgBuy  }} </td>
                    <td> {{ amountBuy  }} </td>
                    <td> {{ totalBuy  }} </td>
                </tr>
            </tbody>
        </table>
        <div class="panel panel-success">
          <div class="panel-heading">Compras
                <form class="form-inline">
                    <label>from</label>
                    <input name="fromDate" class="form-control" v-model="fromDateBuy">
                    <label>to</label>
                    <input name="toDate" class="form-control" v-model="toDateBuy">
                    <button class="btn btn-default">filter</button>
                </form>
          </div>
            <table class="table table-bordered table-striped table-responsive table-condensed">
                <thead>
                    <tr>
                        <th>  </th>
                        <th> Date </th>
                        <th> Rate </th>
                        <th> Amount </th>
                        <th> Fee (%) </th>
                        <th> Total </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="coinsBuy">
                        <tr v-for="coin in coinsBuy">
							<td>
								<template v-if="coin.marked == 1">
									<input  checked type="checkbox" v-bind:value='coin.globalTradeID'/>
								</template>
								<template v-else>
									<input type="checkbox" v-bind:value='coin.globalTradeID'/>
								</template>
							</td>
                            <td> {{ coin.date }} </td>
                            <td> {{ coin.rate }} </td>
                            <td> {{ coin.amount }} </td>
                            <td> {{ parseFloat(coin.fee).toFixed(4) * 100 }} </td>
                            <td> {{ coin.total }} </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="5"> no data </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    <div class="col-md-6 ">
        <table class="table table-bordered table-responsive">
            <caption>
                <h4>Totais Vendas</h4>
            </caption>
            <thead>
                <tr>
                    <th> Rate </th>
                    <th> Amount </th>
                    <th> Total </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> {{ rateAvgSell  }} </td>
                    <td> {{ amountSell  }} </td>
                    <td> {{ totalSell  }} </td>
                </tr>
            </tbody>
        </table>

        <div class="panel  panel-danger">
          <div class="panel-heading">Vendas
                <form class="form-inline">
                    <label>from</label>
                    <input name="fromDate" class="form-control" v-model="fromDateSell">
                    <label>to</label>
                    <input name="toDate" class="form-control" v-model="toDateSell">
                    <button class="btn btn-default">filter</button>
                </form>
          </div>
                <table class="table table-bordered table-striped table-responsive table-condensed">
                    <thead>
                        <tr>
                            <th>  </th>
                            <th> date </th>
                            <th> Rate </th>
                            <th> Amount </th>
                            <th> Fee (%)</th>
                            <th> Total </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="coinsSell">
                            <tr v-for="coin in coinsSell">
                                <td> <input type="checkbox" class="form-control" v-bind:value='coin.globalTradeID'/> </td>
                                <td> {{ coin.date  }} </td>
                                <td> {{ coin.rate  }} </td>
                                <td> {{ coin.amount  }} </td>
                                <td> {{ parseFloat(coin.fee).toFixed(4) * 100 }} </td>
                                <td> {{ coin.total  }} </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="5"> no data </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
        </div>
      </div>
  </div>
  </div>
</template>

<script>

import lodash from 'lodash'
import moment from 'moment'

var _ = lodash

export default {
  name: 'exchange',
  data () {
    return {
      currency: 'ETH',
      coinsSell: 0,
      coinsBuy: 0,
      rateAvgBuy: 0,
      amountBuy: 0,
      totalBuy: 0,
      rateAvgSell: 0,
      amountSell: 0,
      totalSell: 0,
      rateCurrent: 0,
      currencies: {},
      fromDateBuy: '2016-01-01 00:00:00',
      toDateBuy: moment().format('YYYY-MM-D H:mm:ss'),
      fromDateSell: '2016-01-01 00:00:00',
      toDateSell: moment().format('YYYY-MM-D H:mm:ss')
    }
  },
  computed: {
    totalCurrency: function () {
      return parseFloat(this.amountBuy - this.amountSell).toFixed(8)
    },
    rateAvg: function () {
      return parseFloat(this.rateAvgBuy * this.totalCurrency).toFixed(8)
    },
    valueCurrent: function () {
      return parseFloat(this.totalCurrency * this.rateCurrent).toFixed(8)
    },
    profitLoss: function () {
      return parseFloat(this.valueCurrent - this.rateAvg).toFixed(8)
    },
    condition: function () {
      return (this.profitLoss < 0)
    },
    imagePath: function () {
      return require('../assets/' + this.currency + '.png')
    }
  },
  mounted: function () {
    this.currencies = { londing: true }
    this.$http
        .get('api/trade-history/currencies')
        .then(response => {
          this.currencies = response.body
        })
  },
  methods: {
    getData: function (event) {
      this.currency = event.target.value
      console.log(this.$refs)
      var urlSell = 'api/trade-history/' + this.currency + '/exchange/sell' +
          '/' + this.fromDateSell +
          '/' + this.toDateSell

      this.$http.get(urlSell)
          .then(response => {
            this.coinsSell = response.body
            console.log(this.coinsSell)

            this.rateAvgSell = (_.meanBy(this.coinsSell, function (o) {
              return parseFloat(o.rate)
            })).toFixed(8)

            this.amountSell = (_.sumBy(this.coinsSell, function (o) {
              return parseFloat(o.amount)
            })).toFixed(8)

            this.totalSell = (_.sumBy(this.coinsSell, function (o) {
              return parseFloat(o.total)
            })).toFixed(8)
          })

      var urlBuy = 'api/trade-history/' + this.currency + '/exchange/buy' +
            '/' + this.fromDateBuy +
            '/' + this.toDateBuy

      this.$http.get(urlBuy)
          .then(response => {
            this.coinsBuy = response.body

            this.rateAvgBuy = (_.meanBy(this.coinsBuy, function (o) {
              return parseFloat(o.rate)
            })).toFixed(8)

            this.amountBuy = (_.sumBy(this.coinsBuy, function (o) {
              return parseFloat(o.amount)
            })).toFixed(8)

            this.totalBuy = (_.sumBy(this.coinsBuy, function (o) {
              return parseFloat(o.total)
            })).toFixed(8)
          })

      this.$http.get('https://poloniex.com/public?command=returnTicker')
          .then(response => {
            console.log(response.body[this.currency]['last'])
            this.rateCurrent = response.body[this.currency]['last']
          })
    },
    setMarked: function (event) {
      var globalTradeID = event.target.value
      var url = 'http://local.phpolo/api.php?comando=setMarked&globalTradeID=' + globalTradeID

      this.$http.get(url)
          .then(response => {
            // this.rateCurrent = response.body.last
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
