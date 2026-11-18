package com.example.ebankbot.telegram;

import com.example.ebankbot.agents.EbankAiAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.message.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;

/**
 * Bot Telegram : chaque message texte reçu est envoyé à l'agent IA ebank,
 * et sa réponse est renvoyée dans la même conversation.
 * Le bot n'est créé que si telegram.bot.token a une valeur (voir secrets.properties).
 */
@Component
@ConditionalOnExpression("'${telegram.bot.token:}' != ''")
public class TelegramBot implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

    private static final Logger log = LoggerFactory.getLogger(TelegramBot.class);

    private final EbankAiAgent ebankAiAgent;
    private final String botToken;
    private final TelegramClient telegramClient;

    public TelegramBot(EbankAiAgent ebankAiAgent, @Value("${telegram.bot.token}") String botToken) {
        this.ebankAiAgent = ebankAiAgent;
        this.botToken = botToken;
        this.telegramClient = new OkHttpTelegramClient(botToken);
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public LongPollingUpdateConsumer getUpdatesConsumer() {
        return this;
    }

    @Override
    public void consume(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        Message message = update.getMessage();
        String chatId = message.getChatId().toString();
        // l'id du chat sert de conversationId : une mémoire par conversation Telegram
        String conversationId = "telegram-" + chatId;

        String response;
        try {
            response = ebankAiAgent.chat(message.getText(), conversationId);
        } catch (Exception e) {
            log.error("Erreur de l'agent IA", e);
            response = "Désolé, une erreur est survenue. Réessayez dans un instant.";
        }

        // Telegram limite un message à 4096 caractères
        if (response.length() > 4000) response = response.substring(0, 4000);

        try {
            telegramClient.execute(SendMessage.builder().chatId(chatId).text(response).build());
        } catch (TelegramApiException e) {
            log.error("Impossible d'envoyer la réponse Telegram", e);
        }
    }
}
