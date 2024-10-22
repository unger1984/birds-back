import { LogFactory } from './factories/log.factory';
import { WsService } from './domain/services/ws.service';
import { ServiceLocator } from './factories/service.locator';
import { ConfigEntity } from './domain/entities/config.entity';

class Server {
	private readonly _log = LogFactory.getInstance().createLogger('Server');
	private readonly _ws: WsService;
	private readonly _config: ConfigEntity;

	constructor() {
		this._ws = ServiceLocator.getInstance().wsService;
		this._config = ServiceLocator.getInstance().configSource.config;

		this._run();
	}

	private _run(): void {
		this._ws.listen().then(() => {
			this._log.info(
				`WS Server started succes wss://${this._config.HTTP_SERVER_HOST}:${this._config.HTTP_SERVER_WS}`,
			);
		});
	}
}

new Server();

/*

gst-launch-1.0 avfvideosrc device-index=0 ! \
videoconvert ! \
videoflip method=horizontal-flip ! \
clockoverlay font-desc="Sans 14" valignment=bottom time-format="%d.%m.%Y %H:%M:%S +3GMT"  ! \
video/x-raw,width=1920,height=1080 ! \
queue ! \
x264enc speed-preset=veryfast tune=zerolatency ! \
rtspclientsink location=rtsp://birds.unger1984.pro:8554/mystream user-id=media user-pw=Stream12Builder

gst-launch-1.0 avfvideosrc capture-screen=true ! \
videoconvert ! \
clockoverlay font-desc="Sans 14" valignment=bottom time-format="%d.%m.%Y %H:%M:%S +3GMT"  ! \
video/x-raw,width=1920,height=1080 ! \
queue ! \
x264enc speed-preset=veryfast tune=zerolatency ! \
rtspclientsink location=rtsp://birds.unger1984.pro:8554/mystream user-id=media user-pw=Stream12Builder

 */

/*

gst-launch-1.0 rtspsrc location=rtsp://192.168.1.64:8554/mystream latency=0 ! decodebin ! videoscale ! video/x-raw,width=800,height=600 ! autovideosink
gst-launch-1.0 rtspsrc location=rtsp://localhost:8554/mystream latency=0 ! decodebin ! autovideosink

 */
