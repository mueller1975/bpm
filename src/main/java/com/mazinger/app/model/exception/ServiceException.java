package com.mazinger.app.model.exception;

/**
 * Model Service Exception
 * 
 * @author ur04192, 2019.05.14
 */
public class ServiceException extends Exception {

    private static final long serialVersionUID = 1L;

    public ServiceException(String errorMessage) {
        super(errorMessage);
    }

    public ServiceException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}
