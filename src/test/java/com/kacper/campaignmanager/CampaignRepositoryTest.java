package com.kacper.campaignmanager;

import com.kacper.campaignmanager.model.Campaign;
import com.kacper.campaignmanager.repository.CampaignRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CampaignRepositoryTest {
    @Autowired
    CampaignRepository repo;

    @Test
    void saveAndFind() {
        Campaign c = new Campaign();
        c.setName("Test");
        c.setKeywords(List.of("a"));
        c.setBidAmount(new BigDecimal("1.0"));
        c.setCampaignFund(new BigDecimal("10.0"));
        c.setStatus(true);
        c.setRadiusKm(5);
        repo.save(c);
        assertThat(repo.findById(c.getId())).isPresent();
    }

}
