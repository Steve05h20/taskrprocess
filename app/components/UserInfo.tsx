import React, {FC} from 'react';
import Image from 'next/image';

interface UserInfoProps {
    role: string;
    email: string | null;
    name: string | null;
}

const UserInfo : FC<UserInfoProps> = ({role,email,name}) => {
    return (
        <div className="flex items-center">
            <div className={"avatar"}>
                <div className={"ring-primary ring-offset-base-100 w-9 rounded-full ring ring-offset-base-100-2"}>
                    <Image src={"/profile.avif"} alt={"avatar"} height={500} width={500} />
                </div>
            </div>
            <div className={"flex flex-col ml-4"}>
                <span className={"text-xs text-gray-400"}>{role}</span>
                <span className={"text-sm font-bold"}>{name || ""}</span>
                <span className={"text-xs text-gray-400 italic"}>{email || ""}</span>

            </div>
        </div>
    );
};

export default UserInfo;