import { cleanHtml } from "@/helpers/CleanHtml";
import { timeAgo } from "../helpers/timeAgo";
type Comment = {
    id: string;
    body: string;
    createdAt: Date | string;
    user?: {
        name?: string | null;
    };
};

type CommentCardProps = {
    comments: Comment[];
};
const CommentCard = ({ comments }: CommentCardProps) => {
    return (
        <div className="mx-auto max-w-2xl p-6 space-y-6">
            <section>
                <h2 className="text-xl font-semibold mb-3">
                    Comments ({comments.length})
                </h2>

                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Nog geen reacties.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {comments.map((c) => (
                            <li key={c.id} className="rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        {c.user?.name ?? "Anonieme gebruiker"}
                                    </p>
                                    <time
                                        title={new Date(
                                            c.createdAt
                                        ).toLocaleString()}
                                        className="text-xs text-muted-foreground"
                                    >
                                        {timeAgo(c.createdAt)}
                                    </time>
                                </div>

                                {/* render html van de comment */}
                                <div
                                    className="mt-2 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanHtml(c.body),
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};
export default CommentCard;
