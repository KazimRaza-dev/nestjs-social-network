import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ReqUserDto } from 'src/user/dto/req-user.dto';
import { ReqUser } from 'src/user/dacorator/user.dacorator';
import { RolesGuard } from 'src/user/guard/role.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @UseGuards(RolesGuard)
  async makePayment(@ReqUser() user: ReqUserDto) {
    return this.paymentService.makePayment(user.id);
  }

  @Get("/success")
  async paymentSuccess(
    @Query('userId') userId: string,
    @Query('session_id') sessionId: string
  ) {
    return this.paymentService.paymentSuccess(userId, sessionId);
  }

  @Get("/failure")
  async paymentFailure() {
    return this.paymentService.paymentFailed();
  }


}
