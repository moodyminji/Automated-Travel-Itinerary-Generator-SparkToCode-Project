package com.Rihal.BackendBase;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoApi {

    @GetMapping
    public String demoApi(){
        return "Hi this is my first Api";
    }
}
