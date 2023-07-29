package com.walsin.web.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.walsin.model.exception.UntraceableException;
import com.walsin.model.vo.ServiceResponseVO;

@Aspect
@Component
public class ResponseHandlerAspect {

	@Pointcut("@annotation(com.walsin.web.aop.annotation.ErrorResponseHandler)")
	public void handleError() {
	}

	/**
	 * Poincut: 繼承 ServiceController 的 class
	 */
	@Pointcut("this(com.walsin.web.controller.AbstractServiceController)")
	public void serviceType() {
	}

	/**
	 * Pointcut: 加註 @RequestMapping 的 method
	 */
	@Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
	public void requestMapping() {
	}

	/**
	 * Pointcut: 加註 @GetMapping 的 method
	 */
	@Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
	public void getMapping() {
	}

	/**
	 * Pointcut: 加註 @PostMapping 的 method
	 */
	@Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping)")
	public void postMapping() {
	}

	/**
	 * Pointcut: 加註 @DeleteMapping 的 method
	 */
	@Pointcut("@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
	public void deleteMapping() {
	}

	@Around("serviceType() && ( requestMapping() || getMapping() || postMapping() || deleteMapping() )")
	public Object around(ProceedingJoinPoint jp) throws Exception {
		MethodSignature methodSignature = (MethodSignature) jp.getSignature();

		try {
			Object result = jp.proceed(jp.getArgs());
			Class<?> rtn = methodSignature.getReturnType();

			if (rtn.equals(Void.TYPE)) { // void type 的 method
				return ServiceResponseVO.succeed();
			} else { // 有回傳值的 method
				return result instanceof byte[] ? result : ServiceResponseVO.succeed(result);
			}
		} catch (Throwable e) {
			String path = ServletUriComponentsBuilder.fromCurrentRequest().build().getPath();
			Logger logger = LoggerFactory.getLogger(jp.getTarget().getClass());

			if (e instanceof UntraceableException) {
				StackTraceElement elm = e.getStackTrace()[0];
				logger.error("服務發生錯誤 [{}]\n{}\n\tat {}.{}({}:{})", path, e.toString(), elm.getClassName(), elm.getMethodName(),
						elm.getFileName(), elm.getLineNumber());
			} else {
				logger.error("服務發生錯誤 [{}]", path, e);
			}

			return ServiceResponseVO.fail(e);
		}
	}
}
