import { PreferencesContext } from 'Context/PreferencesContext.jsx'
import { useCallback, useContext } from 'react'
import { formatMessage } from 'Tools';

export const useMessages = () => {
    const { state: prefState, dispatch: prefDispatch } = useContext(PreferencesContext)

    const getMessage = useCallback((code, ...args) => {

        if (!prefState.messages) {
            return code
        }

        let message = prefState.messages[code]

        if (!message) {
            return code
        }

        // args.forEach((arg, i) => {
        //     message = message.replace(`{${i + 1}}`, arg)
        // })

        message = formatMessage(message, args);

        return message
    }, [prefState])

    return getMessage
}
