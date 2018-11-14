import { AssetTransaction } from "./AssetTransaction";
import { CreateShard } from "./CreateShard";
import { Payment } from "./Payment";
import { SetRegularKey } from "./SetReulgarKey";
import { SetShardOwners } from "./SetShardOwners";
import { SetShardUsers } from "./SetShardUsers";
import { WrapCCC } from "./WrapCCC";
export declare type Action = AssetTransaction | Payment | SetRegularKey | CreateShard | SetShardOwners | SetShardUsers | WrapCCC;
export declare function getActionFromJSON(json: any): Action;
