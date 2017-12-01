<template>
    <div id="exchange">
        <div class="panel panel-default">
          <div class="panel-heading">
              Config
          </div>
           <div class="panel-body">
                <form class="">
                      <div class="form-group">
                        <label>Api Key</label>
                        <input name="key" class="form-control" v-model="key">
                      </div>
                      <div class="form-group">
                        <label>Secret</label>
                        <input name="toDate" class="form-control" v-model="secret">
                      </div>
                    <button class="btn btn-default btn-success" :click="save()">save</button>
                </form>
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
      key: '',
      secret: ''
    }
  },
  computed: {
  },
  mounted: function () {
  },
  methods: {
    getData: function (event) {
      this.currency = event.target.value
      console.log(this.$refs)
      var urlSell = 'http://local.phpolo/api.php?comando=tradeHistory&currency=' + this.currency + '&category=exchange&type=sell' +
          '&fromDate=' + this.fromDateSell +
          '&toDate=' + this.toDateSell

      this.$http.get(urlSell)
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
    },
    save: function () {
      this.$http.post('/api.php?comando=save', {key: this.key, secret: this.secret})
          .then(response => {
            console.log(response.body)
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
