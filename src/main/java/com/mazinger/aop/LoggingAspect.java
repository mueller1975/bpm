package com.walsin.web.aop;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walsin.model.cas.LoginUser;
import com.walsin.model.cas.WalsinUserDetails;

/**
 * Logging Aspect
 * 
 * @author ur04192
 */
@Aspect
@Component
public class LoggingAspect {

	@Pointcut("@annotation(com.walsin.web.aop.annotation.LogRequest)")
	public void logRequestPointcut() {
	}

	@Before("logRequestPointcut()")
	public void before(JoinPoint jp) {
		Logger logger = LoggerFactory.getLogger(jp.getTarget().getClass());

		HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
		String path = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof WalsinUserDetails) { // 由 CAS 登入
			WalsinUserDetails userDetails = (WalsinUserDetails) principal;
			LoginUser user = userDetails.getLoginUser();

			logger.info("[Request Log] {} {} => {} {} from {}", request.getMethod(), path, user.getEmpId(), user.getName(),
					user.getLoginIP());
		} else { // 使用 API_USER 身份
			UserDetails userDetails = (UserDetails) principal;

			String loginIP = request.getHeader("X-Forwarded-For");
			loginIP = loginIP == null ? request.getRemoteAddr() : loginIP;

			logger.info("[API Request Log] {} {} => {} from {}", request.getMethod(), path, userDetails.getUsername(), loginIP);
		}
	}
}
