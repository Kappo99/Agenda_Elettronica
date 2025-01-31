import React from 'react';
import LoadingIcon from '../../images/loading.svg';

interface IProps {
    height?: string;
}

function Loading(props: IProps) {
    return (
        <div className={`w-full min-h-[${props.height ?? '60vh'}] flex items-center justify-center`}>

            <img src={LoadingIcon} alt='Loading...' className='w-40' />

        </div>
    );
}

export default Loading;
