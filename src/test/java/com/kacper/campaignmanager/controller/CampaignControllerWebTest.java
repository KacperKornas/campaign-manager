package com.kacper.campaignmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kacper.campaignmanager.model.Campaign;
import com.kacper.campaignmanager.repository.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CampaignControllerWebTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CampaignRepository repo;

    @BeforeEach
    void clean() {
        repo.deleteAll();
    }

    @Test
    void fullCrudWithMockMvc() throws Exception {
        Campaign dto = new Campaign();
        dto.setName("WebTest");
        dto.setKeywords(List.of("kw"));
        dto.setBidAmount(new BigDecimal("0.001"));
        dto.setCampaignFund(new BigDecimal("20000.0"));
        dto.setStatus(false);
        dto.setRadiusKm(3);

        String json = objectMapper.writeValueAsString(dto);

        var create = mockMvc.perform(post("/api/campaigns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("WebTest"))
                .andReturn();

        var created = objectMapper.readValue(
                create.getResponse().getContentAsString(), Campaign.class);
        Long id = created.getId();
        assertThat(repo.existsById(id)).isTrue();

        mockMvc.perform(get("/api/campaigns/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keywords[0]").value("kw"));

        created.setName("WebTestUpdated");
        String updatedJson = objectMapper.writeValueAsString(created);
        mockMvc.perform(put("/api/campaigns/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("WebTestUpdated"));

        mockMvc.perform(delete("/api/campaigns/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/campaigns/{id}", id))
                .andExpect(status().isNotFound());
    }
}
