import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./pomocna'), { ssr: false });

export default function Home() {
    return (
        <div>
            <DynamicMap />
        </div>
    );
}
