
export default function QA({question, answer}) {
    return <><div class="flex-row place-items-center mx-2 lg:mx-6 lg:my-0 flex px-4 py-2 rounded-md border border-white
                    text-sm shadow-[4px_4px_0px_0px] bg-secondary text-white w-fit
                    transition-all font-bold shadow-secondary hover:translate-x-[0.5rem]">
                    {question}
                </div><div class="flex-row place-items-center mx-2 lg:my-0 flex px-4 py-2 rounded-md border border-primary
                    text-sm shadow-[4px_4px_0px_0px] bg-white text-primary ml-30 
                    transition-all font-bold shadow-secondary hover:translate-x-[-0.5rem]">
                    {answer}
                </div></>
}