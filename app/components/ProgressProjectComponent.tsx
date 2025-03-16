import React, {FC} from 'react';

interface ProgressProjectProps {
    taskByStauts:number,
    percentage:number,
    status:string,
}

const ProgressProjectComponent : FC<ProgressProjectProps> = ({taskByStauts, percentage, status}) => {
    return (
        <div className={"flex-col flex mb-3"}>
            <h2 className={"text-gray-500 mb-2"}>
                <span className={"font-bold"}>{status}</span>
                <div className={"badge badge-ghost badge-sm ml-1"}>
                    {taskByStauts}
                </div>
            </h2>
            <progress className="progress progress-primary w-full" value={percentage} max="100"></progress>
            <div className={"flex"}>
                <span className={"font-bold text-gray-400 mt-2"}>{percentage}%</span>
            </div>
        </div>
    );
};

export default ProgressProjectComponent;