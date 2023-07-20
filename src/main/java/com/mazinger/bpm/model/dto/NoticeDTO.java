package com.mazinger.bpm.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class NoticeDTO {

	private String notice;

	private List<ReviewerDTO> reviewers;
}
