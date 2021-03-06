import * as React from 'react'

import * as Hooks from '../hooks'

import * as Core from '@material-ui/core'

interface MainProps {
  transformer: (markdownText: string) => string
}

function Main(props: MainProps) {
  const [state, setState] = React.useState({
    leftDepth: 1,
    rightDepth: 1,
    input: localStorage.markdownInput || ''
  })

  const handleTransform = (markdownText: string) => {
    if (props.transformer) {
      return props.transformer(markdownText)
    } else {
      return markdownText
    }
  }

  const handleChange = (text: string) => {
    setState({ ...state, input: text })
    localStorage.markdownInput = text
  }

  const isSmall = !Core.useMediaQuery('@media (min-width: 768px)')

  const { main } = Hooks.useRootStyles()

  const { mainContainer, mainContainerSmall, mainLeft, mainRight, mainPaper } = Hooks.useMainStyles()

  return (
    <main className={main}>
      <div className={isSmall ? mainContainerSmall : mainContainer}>
        <Core.Paper
          className={`${mainLeft} ${mainPaper}`}
          elevation={state.leftDepth}
          onMouseOut={() => setState({ ...state, leftDepth: 1 })}
          onMouseOver={() => setState({ ...state, leftDepth: 2 })}>
          <InputArea inputId='markdown-input' defaultValue={state.input} onChange={handleChange} />
        </Core.Paper>
        <Core.Paper
          className={`${mainRight} ${mainPaper}`}
          elevation={state.rightDepth}
          onMouseOut={() => setState({ ...state, rightDepth: 1 })}
          onMouseOver={() => setState({ ...state, rightDepth: 2 })}>
          <OutputArea value={handleTransform(state.input)} />
        </Core.Paper>
      </div>
    </main>
  )
}

interface InputAreaProps {
  inputId: string
  defaultValue: string
  onChange(text: string): void
}

function InputArea(props: InputAreaProps) {
  const theme = Core.useTheme()
  const style = { display: 'block', lineHeight: theme.typography.body1.lineHeight, margin: 0, padding: 0, minHeight: '100%' }
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }
  return (
    <Core.InputBase
      autoFocus={true}
      fullWidth={true}
      multiline={true}
      id={props.inputId}
      onChange={handleChange}
      value={props.defaultValue}
      placeholder='Markdown Input'
      style={style} />
  )
}

interface OutputAreaProps {
  value: string
}

function OutputArea(props: OutputAreaProps) {
  const theme = Core.useTheme()
  const commonStyle = { lineHeight: theme.typography.body1.lineHeight, margin: 0, padding: 0, minHeight: '100%' }
  if (props.value) {
    const style: React.CSSProperties = { ...commonStyle, whiteSpace: 'pre' }
    return <Core.Typography variant='body1'><p style={style}>{props.value}</p></Core.Typography>
  } else {
    const style: React.CSSProperties = { ...commonStyle, color: 'rgba(0, 0, 0, 0.3)', userSelect: 'none' }
    return <Core.Typography variant='body1'><p style={style}>BBCode Output</p></Core.Typography>
  }
}

export default Main
