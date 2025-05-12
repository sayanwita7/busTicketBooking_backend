import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const busSchema = new Schema (
    {
        id:{
            type:Number,
            required:true
        },
        capacity:{
            type:Number,
            default:0
        },
        departure:{ //time
            type:String,
            required:true
        },
        arrival:{ //time
            type:String,
            required:true
        },
        start:{
            type:String,
            required:true
        },
        end:{
            type:String,
            required:true
        },
        stops:{
            //routes
            type:String
        },
        availableOn:{ //Wed, thurs, etc or just dates!
            type: String,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }, {timestamps: true})

busSchema.plugin (mongooseAggregatePaginate);
export const bus = mongoose.model ("Bus", busSchema);