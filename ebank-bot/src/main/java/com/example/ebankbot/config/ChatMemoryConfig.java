package com.example.ebankbot.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration de la mémoire du chatbot.
 *
 * Le modèle utilisé sur Groq (openai/gpt-oss-120b) est un modèle de "raisonnement" :
 * ses réponses contiennent un champ supplémentaire "reasoning_content".
 * Spring AI sauvegarde ce champ dans l'historique, puis le renvoie à Groq à la
 * question suivante, et Groq le refuse (erreur 400 : "reasoning_content is unsupported").
 *
 * Ce bean ChatMemory remplace celui par défaut : avant de sauvegarder un message
 * de l'assistant, il le recrée avec seulement son texte (sans reasoning_content).
 * Ainsi l'historique est accepté par Groq et le bot se souvient de la conversation.
 * Il garde les 20 derniers messages (MessageWindowChatMemory).
 */

@Configuration
public class ChatMemoryConfig {

    @Bean
    ChatMemory chatMemory() {
        ChatMemory delegate = MessageWindowChatMemory.builder().maxMessages(20).build();
        return new ChatMemory() {
            @Override
            public void add(String conversationId, List<Message> messages) {
                List<Message> clean = messages.stream()
                        .map(m -> m instanceof AssistantMessage a
                                ? (Message) AssistantMessage.builder().content(a.getText()).build()
                                : m)
                        .toList();
                delegate.add(conversationId, clean);
            }

            @Override
            public List<Message> get(String conversationId) {
                return delegate.get(conversationId);
            }

            @Override
            public void clear(String conversationId) {
                delegate.clear(conversationId);
            }
        };
    }
}