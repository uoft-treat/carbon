import "reflect-metadata";

import {Container}             from "inversify";
import {WebRequestAgent}       from "./agent/WebRequestAgent";
import {WebRequestAgentImpl}   from "./agent/impl/WebRequestAgentImpl";
import {Configuration}         from "./configuration/Configuration";
import {Experiment}            from "./experiment/Experiment";
import {ExperimentService}     from "./service/ExperimentService";
import {ExperimentServiceImpl} from "./service/impl/ExperimentServiceImpl";
import {GqlRequestAgent}       from "./agent/GqlRequestAgent";
import {GqlRequestAgentImpl}   from "./agent/impl/GqlRequestAgentImpl";
import {WidgetPool}            from "./widget/WidgetPool";

let container = new Container();

container.bind<WebRequestAgent>("WebRequestAgent").to(WebRequestAgentImpl);
container.bind<GqlRequestAgent>("GqlRequestAgent").to(GqlRequestAgentImpl);

container.bind<Configuration>("Configuration").to(Configuration);
container.bind<Experiment>("Experiment").to(Experiment);
container.bind<ExperimentService>("ExperimentService").to(ExperimentServiceImpl);

container.bind<WidgetPool>("WidgetPool").to(WidgetPool).inSingletonScope();

export default container;
