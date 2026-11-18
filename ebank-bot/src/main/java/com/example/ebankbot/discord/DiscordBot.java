package com.example.ebankbot.discord;

import com.example.ebankbot.agents.EbankAiAgent;
import com.zgamelogic.discord.annotations.DiscordController;
import com.zgamelogic.discord.annotations.DiscordMapping;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;

@DiscordController
public class DiscordBot {
    private EbankAiAgent ebankAiAgent;

    public DiscordBot(EbankAiAgent ebankAiAgent) {
        this.ebankAiAgent = ebankAiAgent;
    }

    @DiscordMapping
    private void perform(MessageReceivedEvent event) {
        if (event.getAuthor().isBot()) return;

        String query = event.getMessage().getContentRaw();
        // l'id de l'utilisateur sert de conversationId : une mémoire par personne
        String conversationId = event.getAuthor().getId();

        String response;
        try {
            response = ebankAiAgent.chat(query, conversationId);
        } catch (Exception e) {
            response = "Désolé, une erreur est survenue. Réessayez dans un instant.";
        }

        // Discord limite un message à 2000 caractères
        if (response.length() > 1990) response = response.substring(0, 1990);

        event.getChannel().sendMessage(response).queue();
    }
}