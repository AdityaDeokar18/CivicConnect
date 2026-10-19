package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class StartWorkRequest {

    @NotBlank(message = "Inspection/work proof is mandatory before moving complaint to IN_PROGRESS")
    private String proofUrl;

    private String remarks;

    public StartWorkRequest() {}

    public StartWorkRequest(String proofUrl, String remarks) {
        this.proofUrl = proofUrl;
        this.remarks = remarks;
    }

    public String getProofUrl() {
        return proofUrl;
    }

    public void setProofUrl(String proofUrl) {
        this.proofUrl = proofUrl;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
