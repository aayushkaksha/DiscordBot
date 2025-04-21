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
    GatewayIntentBits.GuildMembers,
  ],
})

// Slash Command Registration
const commands = [
  new SlashCommandBuilder()
    .setName('embed')
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

  new SlashCommandBuilder()
    .setName('referee')
    .setDescription('Add up to 4 matches with team names and referee')
    // Match 1–4 inputs
    .addStringOption((option) =>
      option
        .setName('team1_1')
        .setDescription('Team 1 (Match 1)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('team2_1')
        .setDescription('Team 2 (Match 1)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('referee_1')
        .setDescription('Referee Name and ID (Match 1)')
        .setRequired(false)
    )

    .addStringOption((option) =>
      option
        .setName('team1_2')
        .setDescription('Team 1 (Match 2)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('team2_2')
        .setDescription('Team 2 (Match 2)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('referee_2')
        .setDescription('Referee Name and ID (Match 2)')
        .setRequired(false)
    )

    .addStringOption((option) =>
      option
        .setName('team1_3')
        .setDescription('Team 1 (Match 3)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('team2_3')
        .setDescription('Team 2 (Match 3)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('referee_3')
        .setDescription('Referee Name and ID (Match 3)')
        .setRequired(false)
    )

    .addStringOption((option) =>
      option
        .setName('team1_4')
        .setDescription('Team 1 (Match 4)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('team2_4')
        .setDescription('Team 2 (Match 4)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('referee_4')
        .setDescription('Referee Name and ID (Match 4)')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Optional: Select a channel to send the message')
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

    // Define allowed roles for each command
    const embedCommandPermissions = [
      {
        id: '526997894348406789', // Admin
        type: 'ROLE',
        permission: true,
      },
      {
        id: '1358083780832923708', // Co Lead
        type: 'ROLE',
        permission: true,
      },
      {
        id: '1226863310461341746', // Moderator
        type: 'ROLE',
        permission: true,
      },
    ]

    const refereeCommandPermissions = [
      {
        id: '526997894348406789', // Admin
        type: 'ROLE',
        permission: true,
      },
      {
        id: '1358083780832923708', // Co Lead
        type: 'ROLE',
        permission: true,
      },
      {
        id: '1226863310461341746', // Moderator
        type: 'ROLE',
        permission: true,
      },
    ]

    // Register the commands and their role-based permissions
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: [
        {
          ...commands[0].toJSON(),
          default_permission: false, // Disable for everyone by default
          permissions: embedCommandPermissions, // Only allow specified roles
        },
        {
          ...commands[1].toJSON(),
          default_permission: false, // Disable for everyone by default
          permissions: refereeCommandPermissions, // Only allow specified roles
        },
      ],
    })

    console.log('✅ Slash commands registered successfully!')
  } catch (error) {
    console.error('❌ Error registering commands:', error)
  }
})

// Interaction Handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'embed') {
    await handleEmbedCommand(interaction)
  }

  if (interaction.commandName === 'referee') {
    await handleRefereeCommand(interaction)
  }
})

// Role Check Function
function hasRequiredRole(interaction, allowedRoles) {
  const memberRoles = interaction.member.roles.cache.map((role) => role.name)
  return allowedRoles.some((role) => memberRoles.includes(role))
}

// 🟦 Handle /embed
async function handleEmbedCommand(interaction) {
  const allowedRoles = ['Admin', 'Co Lead', 'Moderator']
  if (!hasRequiredRole(interaction, allowedRoles)) {
    return interaction.reply({
      content: 'You do not have permission to use this command.',
      flag: 1 << 6,
    })
  }

  const targetChannel = interaction.options.getChannel('channel')
  const title = interaction.options.getString('title')
  const description = interaction.options.getString('description')
  const color = interaction.options.getString('color') || '#743089'
  const image = interaction.options.getString('image')

  const embed = new EmbedBuilder()
    .setTitle(title || 'Title')
    .setDescription(description || 'No description provided.')
    .setColor(color)
    .setTimestamp()

  if (image) embed.setImage(image)

  try {
    if (targetChannel) {
      await interaction.reply({
        content: `Sent to ${targetChannel}`,
        flag: 1 << 6,
      })
      await targetChannel.send({ embeds: [embed] })
    } else {
      await interaction.reply({ embeds: [embed] })
    }
  } catch (err) {
    console.error('Error sending embed:', err)
    await interaction.reply({
      content: 'Something went wrong.',
      flag: 1 << 6,
    })
  }
}

// 🟨 Handle /referee
async function handleRefereeCommand(interaction) {
  const allowedRoles = ['Admin', 'Co Lead', 'Moderator']
  if (!hasRequiredRole(interaction, allowedRoles)) {
    return interaction.reply({
      content: 'You do not have permission to use this command.',
      flag: 1 << 6,
    })
  }
  const spacing = '\u200b'.repeat(3)
  const targetChannel = interaction.options.getChannel('channel')

  const team1_1 = interaction.options.getString('team1_1')
  const team2_1 = interaction.options.getString('team2_1')
  const ref1 = interaction.options.getString('referee_1')

  const team1_2 = interaction.options.getString('team1_2')
  const team2_2 = interaction.options.getString('team2_2')
  const ref2 = interaction.options.getString('referee_2')

  const team1_3 = interaction.options.getString('team1_3')
  const team2_3 = interaction.options.getString('team2_3')
  const ref3 = interaction.options.getString('referee_3')

  const team1_4 = interaction.options.getString('team1_4')
  const team2_4 = interaction.options.getString('team2_4')
  const ref4 = interaction.options.getString('referee_4')

  let description = `${spacing} **Group A**\n`
  if (team1_1 && team2_1 && ref1) {
    description += `${spacing} Match 1: (09:00)\n **${team1_1}** vs **${team2_1}**\n Ref Id: ${ref1}\n\n`
  }
  if (team1_2 && team2_2 && ref2) {
    description += `${spacing} Match 2: (09:00)\n **${team1_2}** vs **${team2_2}**\n Ref Id: ${ref2}\n\n`
  }

  description += `${spacing} **Group B**\n`
  if (team1_3 && team2_3 && ref3) {
    description += `${spacing} Match 1: (09:00)\n **${team1_3}** vs **${team2_3}**\n Ref Id: ${ref3}\n\n`
  }
  if (team1_4 && team2_4 && ref4) {
    description += `${spacing} Match 2: (09:00)\n **${team1_4}** vs **${team2_4}**\n Ref Id: ${ref4}\n\n`
  }

  // You can hardcode semi/finals here or expand options to take them in future
  description += `${spacing} **Semi-Finals**\n`
  description += `${spacing} Match 3: (09:30)\n **Match 1 Winner(A)** vs **Match 2 Winner(A)**\n Ref Id: ${
    ref1 || 'N/A'
  }\n\n`
  description += `${spacing} Match 4: (09:30)\n **Match 1 Winner(B)** vs **Match 2 Winner(B)**\n Ref Id: ${
    ref3 || 'N/A'
  }\n\n`

  description += `${spacing} **FINALS**\n`
  description += `${spacing} Match 5: (10:00)\n **Group A Winner** vs **Group B Winner**\n Ref Id: ${
    ref1 || 'N/A'
  }\n\n`

  const embed = new EmbedBuilder()
    .setTitle('*Referee Allocation*')
    .setDescription(description)
    .setColor('#743089')
    .setTimestamp()

  try {
    if (targetChannel) {
      await interaction.reply({
        content: `Sent to ${targetChannel}`,
        flag: 1 << 6,
      })
      await targetChannel.send({ embeds: [embed] })
    } else {
      await interaction.reply({ embeds: [embed] })
    }
  } catch (err) {
    console.error('Error sending referee embed:', err)
    await interaction.reply({
      content: 'Something went wrong.',
      flag: 1 << 6,
    })
  }
}

client.login(process.env.TOKEN)
