'use client'
import CircularProgress from '@mui/material/CircularProgress'

const ProgressCircule = ({color}) => {
    return (
        <div className={`progress-circule ${color}`}>
            <CircularProgress  className='progress-circule-icon' />
        </div>
    )
}

export const ProgressCirculeInline = ({color}) => {
    return (
        <CircularProgress className={`progress-circule-icon ${color}`} style={{
            display: 'block',
            margin: '10px auto'
        }} />
    )
}

export default ProgressCircule
