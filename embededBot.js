import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes,
} from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Slash Command Registration
const commands = [
  new SlashCommandBuilder()
    .setName('referee')
    .setDescription('Send a custom embedded message')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Optional: Select a channel to send the message')
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

function findChannelId(guild, channelName) {
  const channel = guild.channels.cache.find(
    (ch) => ch.name.toLowerCase() === channelName.toLowerCase()
  )
  return channel ? `<#${channel.id}>` : 'Channel not found!'
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return
  if (interaction.commandName !== 'referee') return

  const targetChannel = interaction.options.getChannel('channel') // ✅ Updated
  const title = interaction.options.getString('title')
  const description = interaction.options.getString('description')
  const color = interaction.options.getString('color') || '#743089'
  const image = interaction.options.getString('image')

  const spacing = '\u200b'.repeat(3)

  const teams = [
    '2AM', //0
    '2PM', //1
    'Nexos Genesis', //2
    '5GG Playz', //3
    'Midnight Havoc', //4
    'Kat Kumari', //5
    'Zero Degree', //6
    'Hunt', //7
    'Elmira', //8
    'Blue Blaze', //9
    'Eie', //10
    'Deity', //11
    'Weinchicago', //12
    'Leemo', //13
    'ishowspeedy', //14
    'Blank Card', //15
    'Bots of Mythic', //16
    'Leemo', //17
    'Kryice', //18
    'Blueblaxe', //19
    'Veggies Alliance', //20
    'Purple Gang', //21
    'Big Black Boys', //22
  ]

  const ref = [
    'Kiseki (865081246)', //0
    'Kobe ? (901897375)', //1
    'SAGENOMORE (1445990905)', //2
    'nemuzi. (396922856)', //3
    'Captain_Ayrus (840532021)', //4
    'DiCoL (551408526)', //5
    'Sensei (755265113)', //6
    'Tsujigiri (738550751)', //7
    'Molika (711202142)', //8
    'NEJ SUHAS (1418049075)', //9
    'Wheezy (874225760)', //10
    'Kiboy (841524280)', //11
  ]

  const artWinners = ['NaasssTy', 'king Bryan', 'Rabin Thulung Rai']

  const honorable = ['Mingma Sherpa']

  const embed = new EmbedBuilder()
    .setTitle(title || '*Referee Allocation*')
    .setDescription(
      description ||
        `${spacing} **Group A**\n` +
          `${spacing} Match 1: (09:00)\n **${teams[22]}** vs **${teams[21]}** \n Ref Id: ${ref[0]}\n\n` +
          `${spacing} Match 2: (09:00)\n **${teams[14]}** vs **${teams[16]}** \n Ref Id: ${ref[6]}\n\n` +
          `${spacing} **Group B**\n` +
          `${spacing} Match 1: (09:00)\n **${teams[6]}** vs **${teams[18]}** \n Ref Id: ${ref[1]} \n\n` +
          `${spacing} Match 2: (09:00)\n **${teams[19]}** vs **${teams[20]}** \n Ref Id: ${ref[11]} \n\n` +
          `${spacing} **Semi-Finals**\n` +
          `${spacing} Match 3: (09:30)\n **Match 1 Winner(A)** vs **Match 2 Winner(A)** \n Ref Id: ${ref[0]}\n\n` +
          `${spacing} Match 4: (09:30)\n **Match 1 Winner(B)** vs **Match 2 Winner(B)** \n Ref Id: ${ref[1]} \n\n` +
          `${spacing} **FINALS**\n` +
          `${spacing} Match 5: (10:00)\n **Group A Winner** vs **Group B Winner** \n Ref Id: ${ref[1]} \n\n`
    )
    // .setTitle(
    //   title ||
    //     '**Monthly MLBB Art Competition (Traditional / Digital) - Official Rules**'
    // )
    // .setDescription(
    //   description ||
    //     `${spacing}Welcome to the Monthly MLBB Art Competition! We are thrilled to showcase the creativity and talent of our community. Please review the following official rules before participating: \n\n` +
    //       `${spacing}**1.** All submissions must be related to Mobile Legends: Bang Bang (MLBB). \n\n` +
    //       `${spacing}**2.** The use of AI is strictly prohibited. \n\n` +
    //       `${spacing}**3.** All artwork must be submitted within the deadline. Late submissions will not be considered.\n\n` +
    //       `${spacing}**📤 How to Submit Your Art** \n Submit your art in ` +
    //       findChannelId(interaction.guild, 'art-submission') +
    //       `.Include these while submitting your art:\nYour **Name**\nYour **MLBB ID** (Server ID). \n
    //         After the submission our moderators will DM you to verify your art. \n For example: **Progress pictures/short videos**\n\n` +
    //       `${spacing} **Monthly Prize Pool**\n 1st PRIZE: **4 Weekly Pass**\n 2nd PRIZE: **2 Weekly Pass**\n 3rd PRIZE: **1 Weekly Pass** \n` +
    //       `${spacing}A Custom **"ARTIST"** role on Discord Server` +
    //       `${spacing}Let’s keep it fun and creative!\n\n` +
    //       `${spacing}April Month Submission Date: **April 12**\n` +
    //       `${spacing}Winner Announcement  Date: **April 14**\n`
    // )
    // .setTitle(title || '**Welcome to 2AM!**')
    // .setDescription(
    //   description ||
    //     `${spacing}Welcome to **2AM** – your ultimate community for MLBB gamers, artists, and cosplayers!\n\n` +
    //       `${spacing}Whether you're here to level up your gameplay, showcase your creativity, or just connect with fellow MLBB fans, you're in the right place!\n\n` +
    //       `${spacing}Here’s what you can do in our community:\n\n` +
    //       `${spacing}**🎮 Join Tournaments & Scrims**\n` +
    //       `${spacing}Test your skills against others by joining regular MLBB scrims and tournaments.\n\n` +
    //       `${spacing}**🎨 Share Your Art**\n` +
    //       `${spacing}Showcase your MLBB-inspired artwork, participate in themed competitions, and get creative inspiration.\n\n` +
    //       `${spacing}**🤝 Connect with Fellow Fans**\n` +
    //       `${spacing}Meet like-minded gamers, artists, and cosplayers who share your love for MLBB.\n\n` +
    //       `${spacing}**✅ Ready to Get Started?**\n` +
    //       `${spacing}• Head over to ` +
    //       findChannelId(interaction.guild, '★-📌rules') +
    //       ` to review our community guidelines.\n` +
    //       `${spacing}• Check ` +
    //       findChannelId(interaction.guild, '★-📢announcements') +
    //       ` for the latest events and updates.\n\n` +
    //       `${spacing}Let’s level up together and make **2AM** an amazing place for everyone! 🚀`
    // )
    // .setTitle(title || '**Daily MLBB Scrims - Information**')
    // .setDescription(
    //   description ||
    //     `${spacing}Welcome to the Daily MLBB Scrims! Please read the following information before participating: \n\n` +
    //       `${spacing}**1.**  There will only be **8 slots** per scrim night. ***Register ASAP!!***\n\n` +
    //       `${spacing}**2.**  All matches will begin at 9:00 PM sharp.\n\n` +
    //       `${spacing}**3.**  All matches leading up to the final will be Best of 1 and the Final match will be a Best of 3.\n\n` +
    //       `${spacing}**4.** Failing to show up without proper notice may result in a temporary **ban** from joining scrims.\n\n` +
    //       `${spacing}**📤 How to Join the Scrims** \n Submit your team details in ` +
    //       findChannelId(interaction.guild, '→📝scrims-registration') +
    //       `${spacing}. \nRegistration time starts at **10:00 AM**.\n` +
    //       `${spacing}Scrims Schedule  will be announced before 06:00 PM in ` +
    //       findChannelId(interaction.guild, '→📅scrims-schedule') +
    //       `.\n If you want to change your schedule notify the moderator before 07:00 PM.`
    // )
    // .setTitle(title || '**🔗Socials**')
    // .setDescription(
    //   description ||
    //     `${spacing}Facebook: https://www.facebook.com/profile.php?id=61574908984446 \n` +
    //       `${spacing} YouTube: https://www.youtube.com/@2AMesportnepal \n` +
    //       `${spacing} Discord: https://discord.gg/T3x4pJ2D9q \n` +
    //       `${spacing} Gmail: 2amesportnepal@gmail.com \n`
    // )
    // .setTitle(title || '** How to Register for Daily MLBB Scrims**')
    // .setDescription(
    //   description ||
    //     `${spacing}Before registration, make sure you have two of your squad member joined in this server to mention.\n\n ` +
    //       `${spacing}**Here's how to register!** \n` +
    //       `${spacing}Team Name: xxxxxxxxx \n@mention1 @mention2 \n\n` +
    //       `${spacing} The registration starts at **10AM Daily.**`
    // )
    // .setTitle(title || '**📌Server Rules**')
    // .setDescription(
    //   `${spacing} **Respect Everyone**  — No harassment, hate speech, or discrimination.\n\n ` +
    //     `${spacing}**Keep It Safe**  — No NSFW, violence, or illegal content.\n\n` +
    //     `${spacing}**Stay On Topic**  — Use the right channels for discussions.\n\n` +
    //     `${spacing}**Promotion Allowed**  — You can promote yourself, but no spam.\n\n` +
    //     `${spacing}**Respect Creativity**  — Credit others’ work. No plagiarism.\n\n` +
    //     `${spacing}**No Leaking  — Don’t** share someone’s work-in-progress without permission.\n\n` +
    //     `${spacing}**Follow Mod **  — Mods have the final say.\n\n` +
    //     `${spacing}Let’s keep it fun and creative!\n\n`
    // )
    // .setTitle(title || '**🎨 Art Results Announcement**')
    // .setDescription(
    //   description ||
    //     `\n` +
    //       `${spacing} **1st Place:** ${artWinners[0]}\t **- 4 Weekly Pass** \n` +
    //       `${spacing} **2nd Place:** ${artWinners[1]}\t **- 3 Weekly Pass** \n` +
    //       `${spacing} **3rd Place:** ${artWinners[2]}\t **- 2 Weekly Pass** \n\n` +
    //       `${spacing} **Honorable Mention**\n` +
    //       `${spacing}• ${honorable[0]}\t **- 1 Weekly Pass** \n\n` +
    //       `${spacing} Congratulations to all the winners.\n\n` +
    //       `${spacing} **Please contact us** if you want to redeem your prize in a certain time period which might be helpful during events. Otherwise prizes will be distributed till tomorrow.\n\n` +
    //       `${spacing} We are thankful to other participants for competing in this contest. We look forward to your new submissions next month. \n\n` +
    //       `${spacing} **Team 2AM**`
    // )
    .setColor(color)
    .setTimestamp()

  if (image) embed.setImage(image)

  const message = { embeds: [embed] }

  try {
    if (targetChannel) {
      await interaction.reply({
        content: `✅ Sending message to ${targetChannel}`,
        ephemeral: true,
      })
      await targetChannel.send(message)
    } else {
      await interaction.reply({
        content: `📩 Sending here as no channel was selected.`,
        ephemeral: true,
      })
      await interaction.channel.send(message)
    }
  } catch (err) {
    console.error('❌ Failed to send message:', err)
    await interaction.reply({
      content: '⚠️ Something went wrong. Could not send the message.',
      ephemeral: true,
    })
  }
})

client.login(process.env.TOKEN)
