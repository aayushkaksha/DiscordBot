import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes,
} from 'discord.js'
import dotenv from 'dotenv'

// Load environment variables securely
dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Command registration
const commands = [
  new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send a custom embedded message')
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription(
          'Optional: Mention the channel to send the message (e.g., #general)'
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('Title of the embed')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Description of the embed')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('color')
        .setDescription('Hex color code (e.g., #0099ff)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('image')
        .setDescription('Image URL for the embed')
        .setRequired(false)
    ),
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`)

  try {
    console.log('⏳ Registering slash commands...')
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands.map((command) => command.toJSON()),
    })
    console.log('✅ Slash commands registered successfully!')
  } catch (error) {
    console.error('❌ Error registering commands:', error)
  }
})

// Utility function to find channel ID by name (fixed this part)
function findChannelId(guild, channelName) {
  const channel = guild.channels.cache.find(
    (ch) => ch.name.toLowerCase() === channelName.toLowerCase()
  )
  return channel ? `<#${channel.id}>` : 'Channel not found!'
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'embed') {
    const channelMention = interaction.options.getString('channel')
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    const color = interaction.options.getString('color') || '#743089' // Default color
    const image = interaction.options.getString('image')

    // Define spacing
    const spacing = '\u200b'.repeat(3) // Adjust the number as needed for visual spacing

    const teams = [
      '2AM', // 0
      '2PM', // 1
      'Foomma', // 2
      '5GG Playz', // 3
      'Astrophel', // 4
      'SC+', // 5
      'Zero Degree', // 6
      'Nexos Genesis', // 7
      'Elmira', // 8
      'Blue Blaze', // 9
      'Eie', // 10
      'Deity', // 11
      'Weinchicago', // 12
      'GALAXY', // 13
      'ishowspeedy', // 14
    ]

    const ref = [
      'Kiseki (865081246)', // 0
      'Kobe ? (901897375)', // 1
      'SAGENOMORE (1445990905)', // 2
      'nemuzi. (396922856)', // 3
      'Captain_Ayrus (840532021)', // 4
      'DiCoL (551408526)', // 5
      'Sensei (755265113)', // 6
      'Tsujigiri (738550751)', // 7
      'Molika (711202142)', // 8
      'NEJ SUHAS (1418049075)', // 9
    ]

    const embedded = new EmbedBuilder()
      .setTitle(title || '**Referee Allocation**')
      .setDescription(
        description ||
          `${spacing} **Group A**\n` +
            `${spacing} Match 1: (**09:00**)\n **${teams[9]} VS ${teams[0]}** \n ref: ${ref[1]}\n\n ` +
            `${spacing} Match 2: (**09:00**)\n **${teams[5]} VS ${teams[13]}** \n ref: ${ref[4]}\n\n ` +
            `${spacing} **Group B**\n` +
            `${spacing} Match 1: (**09:00**)\n **${teams[14]} VS ${teams[3]}** \n ref: ${ref[6]} \n\n` +
            `${spacing} Match 2: (**09:00**)\n **${teams[7]} VS ${teams[12]}** \n ref: ${ref[5]} \n\n` +
            `${spacing} **Semi-Finals**\n` +
            `${spacing} Match 3: (**09:30**)\n **Match 1 Winner(A) VS Match 2 Winner(A)** \n ref: ${ref[1]}\n\n ` +
            `${spacing} Match 3: (**09:30**)\n **Match 1 Winner(B) VS Match 2 Winner(B)** \n ref: ${ref[5]} \n\n` +
            `${spacing} **Finals**\n` +
            `${spacing} Match 4: (**10:00**)\n **Group A Winner VS Group B Winner** \n ref: ${ref[5]} \n\n`
      )
      .setColor(color)
      .setTimestamp()

    if (image) {
      embedded.setImage(image)
    }

    const embed = { embeds: [embedded], content: `​` }

    if (channelMention) {
      try {
        const channelIdMatch = channelMention.match(/<#(\d+)>/)
        const channelId = channelIdMatch ? channelIdMatch[1] : channelMention
        const targetChannel = interaction.guild.channels.cache.get(channelId)

        if (targetChannel) {
          await interaction.reply({
            content: `Sending welcome message to ${channelMention}!`,
            ephemeral: true,
          })
          await targetChannel.send(embed)
        } else {
          await interaction.reply({
            content: 'Channel not found! Sending here instead.',
            ephemeral: true,
          })
          await interaction.channel.send(embed)
        }
      } catch (error) {
        console.error('Error sending to channel:', error)
        await interaction.reply({
          content: 'Error sending to specified channel! Sending here instead.',
          ephemeral: true,
        })
        await interaction.channel.send(embed)
      }
    } else {
      await interaction.reply(embed)
    }
  }
})

client.login(process.env.TOKEN)
