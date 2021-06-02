package com.renegade.whiteboard.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class MappingController {
    @MessageMapping("/whiteboard")
    public void handleMessageWithoutResponse(String message) {
        log.info("Message without response: {}", message);
    }
}
