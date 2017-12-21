/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { BroadlinkController } from './../api/controllers/broadlink';
import { HealthController } from './../api/controllers/health';
import { ChromecastController } from './../api/controllers/chromecast';

const models: TsoaRoute.Models = {
    "ResponseModel": {
        "properties": {
            "status": { "dataType": "double", "required": true },
            "message": { "dataType": "string", "required": true },
        },
    },
    "BroadlinkDeviceInfo": {
        "properties": {
            "id": { "dataType": "double", "required": true },
            "host": { "dataType": "string", "required": true },
            "mac": { "dataType": "string" },
            "type": { "dataType": "string", "required": true },
        },
    },
    "BroadlinkRequest": {
        "properties": {
            "device": { "dataType": "enum", "enums": ["Projector", "TV"], "required": true },
            "command": { "dataType": "string", "required": true },
        },
    },
    "ChromecastOperations": {
        "enums": ["play", "pause", "resume", "stop", "seek", "subtitles"],
    },
    "ChromecastMediaOptions": {
        "properties": {
            "title": { "dataType": "string" },
            "type": { "dataType": "string" },
            "seek": { "dataType": "double" },
            "subtitles": { "dataType": "array", "array": { "dataType": "string" } },
            "autoSubtitles": { "dataType": "boolean" },
        },
    },
    "ChromecastRequest": {
        "properties": {
            "command": { "ref": "ChromecastOperations", "required": true },
            "url": { "dataType": "string" },
            "options": { "ref": "ChromecastMediaOptions" },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/v1/Broadlink/Discover',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BroadlinkController();


            const promise = controller.discoverBroadlinkDevices.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/Broadlink/Devices',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BroadlinkController();


            const promise = controller.getBroadlinkDevices.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/Broadlink/Devices/:deviceId',
        function(request: any, response: any, next: any) {
            const args = {
                deviceId: { "in": "path", "name": "deviceId", "required": true, "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BroadlinkController();


            const promise = controller.getBroadlinkDevice.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/v1/Broadlink/Devices/:deviceId/Controller',
        function(request: any, response: any, next: any) {
            const args = {
                deviceId: { "in": "path", "name": "deviceId", "required": true, "dataType": "double" },
                model: { "in": "body", "name": "model", "required": true, "ref": "BroadlinkRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BroadlinkController();


            const promise = controller.putBroadlinkDeviceController.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/HealthCheck',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HealthController();


            const promise = controller.getHealth.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/v1/Chromecast/Discover',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.discoverChromecasts.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/Chromecast/Devices',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.getChromecastDevices.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/Chromecast/Devices/:deviceId',
        function(request: any, response: any, next: any) {
            const args = {
                deviceId: { "in": "path", "name": "deviceId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.getChromecastDevice.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/v1/Chromecast/Devices/:deviceId/Controller',
        function(request: any, response: any, next: any) {
            const args = {
                deviceId: { "in": "path", "name": "deviceId", "required": true, "dataType": "string" },
                model: { "in": "body", "name": "model", "required": true, "ref": "ChromecastRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.putChromecastDeviceController.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/v1/Chromecast/Default/Controller',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "ChromecastRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.controlChromecast.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/v1/Chromecast/Default',
        function(request: any, response: any, next: any) {
            const args = {
                device_name: { "in": "header", "name": "device_name", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.setDefaultChromecastDevice.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/v1/Chromecast/Status',
        function(request: any, response: any, next: any) {
            const args = {
                device_name: { "in": "header", "name": "device_name", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ChromecastController();


            const promise = controller.getChromecastDeviceStatus.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });


    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
