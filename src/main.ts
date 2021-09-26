import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth/jwt.auth.guard";
import { ValidationPipe } from "@nestjs/common";


async function strart() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle(`iLink Backend Task`)
    .setDescription(`REST API Documentation`)
    .setVersion(`1.0`)
    .addTag(`grinyaevm`)
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/docs`, app, document)
  // app.useGlobalGuards(JwtAuthGuard)

  app.useGlobalPipes(new ValidationPipe())

  await  app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

strart()