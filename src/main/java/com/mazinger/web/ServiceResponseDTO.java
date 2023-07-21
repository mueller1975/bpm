package com.mazinger.web;

import lombok.Data;

@Data
public class ServiceResponseDTO {

	public static final int DEFAULT_FAIL_CODE = 100;
	protected int code;
	protected Object data;

	public ServiceResponseDTO() {
	}

	public ServiceResponseDTO(int code, Object data) {
		this.code = code;
		this.data = data;
	}

	public static ServiceResponseDTO succeed() {
		return new ServiceResponseDTO(0, "SUCCESS");
	}

	public static ServiceResponseDTO succeed(Object data) {
		return new ServiceResponseDTO(0, data);
	}

	public static ServiceResponseDTO fail(int code, Object data) {
		return new ServiceResponseDTO(code, data);
	}

	public static ServiceResponseDTO fail(Object data) {
		return new ServiceResponseDTO(DEFAULT_FAIL_CODE, data);
	}

	public static ServiceResponseDTO fail(Throwable e) {
		String message = e.getMessage();

		if (e.getCause() != null) {
			message = String.format("%s (%s)", message, e.getCause().getMessage());
		}

		return new ServiceResponseDTO(DEFAULT_FAIL_CODE, message);
	}
}
