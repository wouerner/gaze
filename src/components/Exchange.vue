<template>
    <div id="exchange">
    <div class="row">
        <div class="col-md-2">
            <img :src="imagePath" width="100">
        </div>
        <div class="col-md-8">
            <h1>Poloniex View Trade</h1>
            <button v-for="(currency, index ) in currencies" v-on:click="getData" v-bind:value="index" class="btn btn-default"> {{index}} </button>
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
                    <td> {{ totalBuy  }} </td>
                    <td> {{ amountBuy  }} </td>
                </tr>
            </tbody>
        </table>
        <div class="panel panel-default">
          <div class="panel-heading">Compras</div>
            <table class="table table-bordered table-striped table-responsive table-condensed">
                <thead>
                    <tr>
                        <th> Date </th>
                        <th> Rate </th>
                        <th> Amount </th>
                        <th> Fee (%) </th>
                        <th> Total </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="coin in coinsBuy">
                        <td> {{ coin.date }} </td>
                        <td> {{ coin.rate }} </td>
                        <td> {{ coin.amount }} </td>
                        <td> {{ parseFloat(coin.fee).toFixed(4) * 100 }} </td>
                        <td> {{ coin.total }} </td>
                    </tr>
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
                    <td> {{ totalSell  }} </td>
                    <td> {{ amountSell  }} </td>
                </tr>
            </tbody>
        </table>

        <div class="panel panel-default">
          <div class="panel-heading">Vendas</div>
                <table class="table table-bordered table-striped table-responsive table-condensed">
                    <thead>
                        <tr>
                            <th> date </th>
                            <th> Rate </th>
                            <th> Amount </th>
                            <th> Fee (%)</th>
                            <th> Total </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="coin in coinsSell">
                            <td> {{ coin.date  }} </td>
                            <td> {{ coin.rate  }} </td>
                            <td> {{ coin.amount  }} </td>
                            <td> {{ parseFloat(coin.fee).toFixed(4) * 100 }} </td>
                            <td> {{ coin.total  }} </td>
                        </tr>
                    </tbody>
                </table>
        </div>
      </div>
  </div>
  </div>
</template>

<script>

import lodash from 'lodash'

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
      currencies: []
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
    this.$http
        .get('http://local.phpolo/api.php?comando=currencies')
        .then(response => {
          this.currencies = response.body
        })
  },
  methods: {
    getData: function (event) {
      this.currency = event.target.value
      this.$http.get('http://local.phpolo/api.php?comando=tradeHistory&currency=' + this.currency + '&category=exchange&type=sell')
          .then(response => {
            this.coinsSell = response.body

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

      this.$http.get('http://local.phpolo/api.php?comando=tradeHistory&currency=' + this.currency + '&category=exchange&type=buy')
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

      this.$http.get('http://local.phpolo/api.php?comando=getTicket&currency=' + 'BTC_' + this.currency)
          .then(response => {
            this.rateCurrent = response.body.last
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
