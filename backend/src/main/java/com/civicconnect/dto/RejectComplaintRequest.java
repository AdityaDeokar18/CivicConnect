package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectComplaintRequest {

    @NotBlank(message = "Rejection reason is mandatory")
    private String reason;

    public RejectComplaintRequest() {}

    public RejectComplaintRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
