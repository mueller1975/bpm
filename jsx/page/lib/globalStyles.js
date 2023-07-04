/**
 * Global CSS
 */
export default themeType =>
    themeType == 'light' ?
        // 淺色主題
        {
            '::-webkit-scrollbar': {
                width: 12,
                height: 12
            },

            '::-webkit-scrollbar-thumb': {
                background: 'linear-gradient(0deg, #a3c1d9, rgb(252 224 141), #a3c1d9)',
                border: '3px solid rgb(246 246 246)',
                borderRadius: 8
            },

            '::-webkit-scrollbar-thumb:horizontal': {
                background: 'linear-gradient(90deg, #a3c1d9, rgb(252 224 141), #a3c1d9)'
            },

            '::-webkit-scrollbar-track': {
                background: '#dedede',
                border: '4px solid transparent',
                backgroundClip: 'content-box'
            },

            '::-webkit-scrollbar-corner': {
                backgroundColor: '#bdbdbd',
                borderRadius: '0 0 2px 0'
            }

        } :
        // 深色主題
        {
            '::-webkit-scrollbar': {
                width: 12,
                height: 12
            },

            '::-webkit-scrollbar-thumb': {
                background: 'linear-gradient(0deg, #4e9ad5, #dccc1d, #4e9ad5)',
                border: '3px solid #364e70',
                borderRadius: 8
            },

            '::-webkit-scrollbar-thumb:horizontal': {
                background: 'linear-gradient(90deg, #4e9ad5, #dccc1d, #4e9ad5)'
            },

            '::-webkit-scrollbar-track': {
                background: '#2f2f2f',
                border: '4px solid transparent',
                backgroundClip: 'content-box'
            },

            '::-webkit-scrollbar-corner': {
                backgroundColor: '#5d798d',
                borderRadius: '0 0 2px 0'
            }
        }
    ;