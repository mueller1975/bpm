import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const fontFamily = '微軟正黑體'

const typographyOptions = {
    normal: { fontFamily, fontSize: 16 },
    smaller: { fontFamily, fontSize: 12 },
    larger: { fontFamily, fontSize: 20 }
}

const cellPaddingOptions = {
    normal: 8, smaller: 4, larger: 16
}

const MuiButton = {
    variants: [
        { // 自定義 Button variant
            props: { variant: 'original' },
            style: {
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, .5)'
            }
        }
    ]
}

const paletteOptions = {
    light: {
        mode: 'light',
        // background: { paper: '#f3f3f3' }
        background: { paper: '#fbfbfb' }
    },
    dark: {
        mode: 'dark',
        background: { paper: '#202020' },
        primary: {
            main: '#6d95cc'
        },
        secondary: {
            main: '#ff327b',
            // light: '#e33371',
            // main: '#dc004e',            
            // dark: '#9a0036',
        },
        // 自定義 color
        neutral: {
            main: 'rgb(255 255 255 / 60%)'
        },
    }
}

export const LIGHT = "light", DARK = "dark", NORMAL = "normal", SMALLER = "smaller", LARGER = "larger"

export const createAppTheme = (themeType, fontSize, cellPadding) => {
    let palette = paletteOptions[themeType]
    let typography = typographyOptions[fontSize]
    let tableCellPadding = cellPaddingOptions[cellPadding]

    let components = {
        MuiButton: {
            ...MuiButton,
            styleOverrides: {
                contained: {
                    color: '#fff'
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: themeType == 'light' ?
                        'linear-gradient(30deg,rgb(190 210 253 / 90%),rgb(237 244 255 / 85%),rgb(190 210 253 / 90%))' :
                        'linear-gradient(-45deg,rgba(2, 6, 14, 0.9),rgb(14 35 78 / 90%),rgba(2, 6, 14, 0.9))'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                }
            }
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    backgroundColor: themeType == 'light' ? 'rgb(255 255 255 / 90%)' : 'rgb(0 0 0 / 85%)'
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: themeType == 'light' ? 'rgb(133 133 133 / 92%)' : 'rgb(0 0 0 / 85%)'
                },
                arrow: {
                    color: themeType == 'light' ? 'rgb(133 133 133 / 92%)' : 'rgb(0 0 0 / 85%)'
                },
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    // backgroundColor: 'rgba(57, 76, 111, 0.85)'
                    backgroundColor: themeType == 'light' ? 'rgb(225 225 225 / 90%)' : 'rgb(52 58 78 / 87%)'
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '12px 20px'
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '0 20px 20px'
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&:not(.Mui-error)': {
                        color: 'rgb(125 139 230)', 
                    }
                },
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    // margin: '4px 0'
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    textAlign: 'right',
                    whiteSpace: 'noWrap',
                    marginTop: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: tableCellPadding,
                }
            }
        },
        MuiListItemSecondaryAction: {
            styleOverrides: {
                root: {
                    right: 4,
                }
            }
        }
    };

    return responsiveFontSizes(createTheme({ palette, typography, components }));
};
