require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Привет!\nНажми /rates чтобы получить ТОП-10 криптовалют'))
bot.command('rates', async (ctx) => {
  const ratesArray = await getRates()
  const rates = ratesArray.filter((res, index) => index < 10).map(item => {
    const percent = item.quote.USD.percent_change_1h > 0 ? `📈 +${item.quote.USD.percent_change_1h.toFixed(2)}%` : `📉 ${item.quote.USD.percent_change_1h.toFixed(2)}%`
    return `${item.symbol} | 🇺🇸 ${item.quote.USD.price.toFixed(2)} | 🇷🇺 ${(item.quote.USD.price * 72.96).toFixed(2)} |  ${percent}`
  })
  ctx.reply(rates.join('\n'))
})

const getRates = async () => {
  const result = await axios({
    method: 'GET',
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    headers: {'X-CMC_PRO_API_KEY': process.env.CMC_KEY}
  })
  return result.data.data
}

bot.launch()
bot.telegram.getMe().then((res) => console.log(res))
console.log(" [x] Bot running locally, mode: ", process.env.NODE_ENV)