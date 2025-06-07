package com.example.reservationsalle.config;

// src/main/java/com/reservationservice/config/RabbitMQConfig.java
// src/main/java/com/reservationservice/config/RabbitMQConfig.java

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange; // Import for FanoutExchange
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange names to be used for sending messages
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
    public static final String BROADCAST_NOTIFICATION_EXCHANGE = "broadcast.notification.exchange";

    // Queue names (declared here for consistency, even if this service doesn't consume them directly)
    public static final String INDIVIDUAL_NOTIFICATION_QUEUE = "individual.notification.queue";
    public static final String GROUP_NOTIFICATION_QUEUE = "group.notification.queue";
    public static final String ALL_USERS_NOTIFICATION_QUEUE = "all.users.notification.queue";


    // Routing keys to be used for sending messages on the Direct Exchange
    public static final String ROUTING_KEY_INDIVIDUAL = "notification.individual";
    public static final String ROUTING_KEY_GROUP = "notification.group";

    /**
     * Declares a Direct Exchange for targeted notifications (individual and group).
     * Messages sent to this exchange are routed based on the exact routing key.
     * It is durable (persists after broker restart) and not auto-delete (does not delete itself when unused).
     * @return The DirectExchange instance.
     */
    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(NOTIFICATION_EXCHANGE, true, false);
    }

    /**
     * Declares a Fanout Exchange for general broadcast notifications.
     * Messages sent to this exchange are broadcast to all queues bound to it.
     * Durable and not auto-delete.
     * @return The FanoutExchange instance.
     */
    @Bean
    public FanoutExchange broadcastNotificationExchange() {
        return new FanoutExchange(BROADCAST_NOTIFICATION_EXCHANGE, true, false);
    }

    // Below, queues and bindings are declared to ensure
    // that queues exist on the RabbitMQ broker upon startup of this service,
    // even if this service is not a direct consumer. This aids in discovery.

    /**
     * Declares the queue for individual notifications.
     * @return The Queue instance.
     */
    @Bean
    public Queue individualNotificationQueue() {
        return new Queue(INDIVIDUAL_NOTIFICATION_QUEUE, true);
    }

    /**
     * Declares the queue for group notifications.
     * @return The Queue instance.
     */
    @Bean
    public Queue groupNotificationQueue() {
        return new Queue(GROUP_NOTIFICATION_QUEUE, true);
    }

    /**
     * Declares the queue for general broadcast notifications to all users.
     * @return The Queue instance.
     */
    @Bean
    public Queue allUsersNotificationQueue() {
        return new Queue(ALL_USERS_NOTIFICATION_QUEUE, true);
    }

    /**
     * Binds the individual queue to the direct exchange with the specific routing key.
     * @param individualNotificationQueue The individual notification queue.
     * @param notificationExchange The notification exchange.
     * @return The Binding instance.
     */
    @Bean
    public Binding individualBinding(Queue individualNotificationQueue, DirectExchange notificationExchange) {
        return BindingBuilder.bind(individualNotificationQueue)
                             .to(notificationExchange)
                             .with(ROUTING_KEY_INDIVIDUAL);
    }

    /**
     * Binds the group queue to the direct exchange with the specific routing key.
     * @param groupNotificationQueue The group notification queue.
     * @param notificationExchange The notification exchange.
     * @return The Binding instance.
     */
    @Bean
    public Binding groupBinding(Queue groupNotificationQueue, DirectExchange notificationExchange) {
        return BindingBuilder.bind(groupNotificationQueue)
                             .to(notificationExchange)
                             .with(ROUTING_KEY_GROUP);
    }

    /**
     * Binds the general broadcast queue to the Fanout Exchange.
     * @param allUsersNotificationQueue The general broadcast queue.
     * @param broadcastNotificationExchange The broadcast Fanout Exchange.
     * @return The Binding instance.
     */
    @Bean
    public Binding allUsersBinding(Queue allUsersNotificationQueue, FanoutExchange broadcastNotificationExchange) {
        // A Fanout Exchange does not use routing keys for bindings, so the 'with()' is empty
        return BindingBuilder.bind(allUsersNotificationQueue)
                             .to(broadcastNotificationExchange);
    }
}
