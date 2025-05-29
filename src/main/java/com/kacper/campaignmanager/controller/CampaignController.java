package com.kacper.campaignmanager.controller;

import com.kacper.campaignmanager.model.Campaign;
import com.kacper.campaignmanager.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignController {
    private final CampaignService service;

    @GetMapping
    public List<Campaign> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Campaign get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Campaign create(@Valid @RequestBody Campaign c) {
        return service.create(c);
    }

    @PutMapping("/{id}")
    public Campaign update(@PathVariable Long id, @Valid @RequestBody Campaign c) {
        return service.update(id, c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
