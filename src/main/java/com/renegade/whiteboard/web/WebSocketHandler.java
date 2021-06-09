package com.renegade.whiteboard.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import java.io.IOException;
import java.util.*;

@Component
@Slf4j
public class WebSocketHandler extends BinaryWebSocketHandler {

    Map<Integer, List<WebSocketSession>> rooms = new HashMap<>();
    Map<Integer, List<BinaryMessage>> messages = new HashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        Integer room = retrieveRoomNumber(session.getUri().getQuery());
        log.info("Text message: {}", message.getPayload());
        if (rooms.containsKey(room)) {
            for (WebSocketSession socketSession : rooms.get(room)) {
                try {
                    socketSession.sendMessage(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        Integer room = retrieveRoomNumber(session.getUri().getQuery());
        log.info("Binary message: {}", message.getPayload());
        messages.get(room).add(message);
        if (message.getPayload().get(16) == 1) {
            messages.get(room).clear();
        }
        if (rooms.containsKey(room)) {
            for (WebSocketSession socketSession : rooms.get(room)) {
                try {
                    socketSession.sendMessage(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Integer room = retrieveRoomNumber(session.getUri().getQuery());
        log.info("New session to room: {}", room);
        if (rooms.containsKey(room)) {
            rooms.get(room).add(session);
        } else {
            rooms.put(room, new ArrayList<>(Collections.singletonList(session)));
        }
        if (messages.containsKey(room)) {
            for (BinaryMessage message: messages.get(room)) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else {
            messages.put(room, new ArrayList<>());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Integer room = retrieveRoomNumber(session.getUri().getQuery());
        if (rooms.containsKey(room)) {
            List<WebSocketSession> sessions = rooms.get(room);
            sessions.remove(session);
            if (sessions.isEmpty()) {
                rooms.remove(room);
                messages.remove(room);
            }
        }
    }

    private Integer retrieveRoomNumber(String param) {
        String[] splitQuery = param.split("=");
        if (splitQuery.length != 2 || ! "room".equals(splitQuery[0])) {
            throw new RuntimeException("Wrong URI!");
        }
        return Integer.parseInt(splitQuery[1]);
    }

}
