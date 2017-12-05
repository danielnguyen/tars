import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import { HealthService } from '../../services/health.service';
import { User, UserCreationRequest} from '../models/health';
 
@Route('Health')
export class UsersController extends Controller {
    @Get('{id}')
    public async getUser(id: number, @Query() name: string): Promise<User> {
        return await new UserService().get(id);
    }
 
    @SuccessResponse('201', 'Created') // Custom success response
    @Post()
    public async createUser(@Body() requestBody: UserCreationRequest): Promise<void> {
        new UserService().create(request);
        this.setStatus(201); // set return status 201
        return Promise.resolve();
    }
 
    @Get('{id}')
    public async getPrivateUser(@Path('id') ID: number, @Header('Authorization') authorization: string): Promise<User> {
        return new UserService().get(id);
    }
}