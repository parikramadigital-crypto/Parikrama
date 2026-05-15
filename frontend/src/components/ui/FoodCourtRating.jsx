import {
  Star,
  UtensilsCrossed,
  ShieldCheck,
  HeartHandshake,
  MessageSquare,
} from "lucide-react";
import { formatDateString } from "../../utils/mongoDB_DateTime";

const RatingBar = ({ label, value, icon: Icon, color, iconColor }) => {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Icon size={18} className={iconColor} />
          <span className="text-xs font-medium text-gray-700">{label}</span>
        </div>

        <span className="font-semibold">{value}/5</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color.replace("text", "bg")}`}
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const FoodCourtRatings = ({ ratings, reviews }) => {
  return (
    <div className="space-y-6 ">
      {/* Main Rating Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left */}
          <div className="flex flex-col items-center justify-center min-w-[220px]">
            <div className="text-4xl font-bold text-[#FFC20E]">
              {ratings?.overallAvg?.toFixed(1)}
            </div>

            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className={`${
                    i < Math.round(ratings?.overallAvg)
                      ? "fill-[#FFC20E] text-[#FFC20E]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-500 mt-2">
              {ratings?.totalReviews} Reviews
            </p>
          </div>

          {/* Right */}
          <div className="flex-1 space-y-5">
            <RatingBar
              label="Food Quality"
              value={ratings?.foodAvg || 0}
              icon={UtensilsCrossed}
              color="text-[#FFC20D]"
              iconColor="text-green-500"
            />

            <RatingBar
              label="Hygiene"
              value={ratings?.hygieneAvg || 0}
              icon={ShieldCheck}
              color="text-[#FFC20D]"
              iconColor="text-red-500"
            />

            <RatingBar
              label="Behaviour"
              value={ratings?.behaviourAvg || 0}
              icon={HeartHandshake}
              color="text-[#FFC20D]"
              iconColor="text-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-2">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-[#FFC20E]" />
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
        </div>

        <div className="space-y-1">
          {reviews?.map((review) => (
            <div
              key={review._id}
              className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {review.customerName}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {/* {new Date(review.createdAt).toLocaleDateString()} */}
                    {formatDateString(review.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star size={16} className="fill-[#FFC20E] text-[#FFC20E]" />
                  <span className="font-semibold">
                    {(
                      (review.food + review.hygiene + review.behaviour) /
                      3
                    ).toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mt-2">{review.comment}</p>

              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="bg-orange-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500">Food</p>
                  <p className="font-bold text-orange-500">{review.food}/5</p>
                </div>

                <div className="bg-green-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500">Hygiene</p>
                  <p className="font-bold text-green-500">{review.hygiene}/5</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500">Behaviour</p>
                  <p className="font-bold text-blue-500">
                    {review.behaviour}/5
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews?.length === 0 && (
          <div className="text-center text-gray-500 py-10">No reviews yet</div>
        )}
      </div>
    </div>
  );
};

export default FoodCourtRatings;
